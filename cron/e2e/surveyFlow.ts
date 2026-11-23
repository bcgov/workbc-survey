// First import. utils/htmlEmail.js cannot load the TypeScript config module.
import "./preload";
import { randomInt } from "node:crypto";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";

import {
  getEnv,
  getExitFormToken,
  getForestryFormToken,
  getInProgressFormToken,
  getIntake1aFormToken,
} from "../config/config";
import { runReminders, runSendSurvey, runUpdateJobs } from "../jobs";
import { REMINDER_INTERVALS, SURVEY_TYPES } from "../surveys/catalog";

import { isRecord } from "./isRecord";
import { submitForm } from "./submitForm";

const [reminder1, reminder2] = REMINDER_INTERVALS;

const WELCOME_SURVEY_TYPE = "1a";
const IN_PROGRESS_SURVEY_TYPE = "2";
const EXIT_3A_SURVEY_TYPE = "3a";
const EXIT_3B_SURVEY_TYPE = "3b";
const FORESTRY_SURVEY_TYPE = "4";
const CONTACT_ID_FLOOR = 900_000_000_000;
const REAL_EMAIL_CONTACT_ID = 555555000;

type QueryResult = {
  rows: Array<Record<string, unknown>>;
  rowCount: number | null;
};

type Db = {
  query(text: string, params?: readonly unknown[]): Promise<QueryResult>;
};

type RecipientRow = {
  id: number;
  emailSent: boolean;
  emailError: boolean;
  emailId: string | null;
  surveyDate: string | null;
  surveyCompleted: boolean;
  reminders: unknown;
  columns: Record<string, unknown>;
};

const db = require("../db/db") as Db;

async function main(): Promise<void> {
  let insertedId: number | undefined;
  try {
    const surveyType = parseSurveyType(process.argv);
    if (
      surveyType !== WELCOME_SURVEY_TYPE &&
      surveyType !== IN_PROGRESS_SURVEY_TYPE &&
      surveyType !== EXIT_3A_SURVEY_TYPE &&
      surveyType !== EXIT_3B_SURVEY_TYPE &&
      surveyType !== FORESTRY_SURVEY_TYPE
    ) {
      throw new Error(
        `Survey type ${surveyType} is not implemented. Implemented types: ${WELCOME_SURVEY_TYPE}, ${IN_PROGRESS_SURVEY_TYPE}, ${EXIT_3A_SURVEY_TYPE}, ${EXIT_3B_SURVEY_TYPE}, ${FORESTRY_SURVEY_TYPE}.`,
      );
    }

    const firstName = requiredEnv("E2E_RECIPIENT_FIRST_NAME");
    const lastName = requiredEnv("E2E_RECIPIENT_LAST_NAME");
    const email = requiredEnv("E2E_RECIPIENT_EMAIL");

    const env = getEnv();
    if (env.environment !== "DEV" && env.environment !== "TEST") {
      throw new Error(
        `ENVIRONMENT must be DEV or TEST. Current value is ${env.environment}.`,
      );
    }
    if (!process.stdin.isTTY) {
      throw new Error("stdin is not a TTY. This script is interactive.");
    }

    console.log(`${env.pgHost}:${env.pgPort}/${env.pgDatabase}`);
    await confirm("Type TEST to continue: ", "TEST");

    await assertSurveyExists(surveyType);
    await assertNoMatchingRecipients();
    console.log("Pre-flight counts are 0");

    const contactId = await allocateContactId();
    const inserted = await db.query(
      `INSERT INTO api.recipients
         ("firstName", "lastName", email, "emailSent", "emailError", "surveyCompleted", "surveyType", "contactId", language)
       VALUES ($1, $2, $3, false, false, false, $4, $5, 'EN')
       RETURNING id`,
      [firstName, lastName, email, surveyType, contactId],
    );
    const id = parseId(inserted.rows[0]?.id);
    insertedId = id;
    if (inserted.rowCount !== 1) {
      throw new Error(`Insert affected ${String(inserted.rowCount)} rows`);
    }
    console.log(`Inserted recipient id ${id} contactId ${contactId}`);

    await runSendSurvey();
    const invited = await readRecipient(id);
    await assertInvite(invited);
    logRecipient(invited);
    await confirm("Type yes if the invite email is in your inbox: ", "yes");

    const reminder1Update = await db.query(
      `UPDATE api.recipients SET "surveyDate" = CURRENT_DATE - 15 WHERE id = $1`,
      [id],
    );
    assertOneRow(reminder1Update, "Reminder 1 backdate");
    await runReminders(reminder1);
    const afterReminder1 = await readRecipient(id);
    assertReminderEmailId(afterReminder1.reminders, "reminder1");
    logRecipient(afterReminder1);
    await confirm(
      "Type yes if the reminder 1 email is in your inbox: ",
      "yes",
    );

    const reminder2Update = await db.query(
      `UPDATE api.recipients SET "surveyDate" = CURRENT_DATE - 31 WHERE id = $1`,
      [id],
    );
    assertOneRow(reminder2Update, "Reminder 2 backdate");
    await runReminders(reminder2);
    const afterReminder2 = await readRecipient(id);
    assertReminderEmailId(afterReminder2.reminders, "reminder1");
    assertReminderEmailId(afterReminder2.reminders, "reminder2");
    logRecipient(afterReminder2);
    await confirm(
      "Type yes if the reminder 2 email is in your inbox: ",
      "yes",
    );

    if (surveyType === WELCOME_SURVEY_TYPE) {
      await submitForm({
        label: "Welcome form",
        fixtureFile: "welcomeSubmission.json",
        formId: env.intake1aFormId,
        token: getIntake1aFormToken(),
        contactId,
      });
    } else if (surveyType === IN_PROGRESS_SURVEY_TYPE) {
      await submitForm({
        label: "In-progress form",
        fixtureFile: "inProgressSubmission.json",
        formId: env.inProgressFormId,
        token: getInProgressFormToken(),
        contactId,
      });
    } else if (
      surveyType === EXIT_3A_SURVEY_TYPE ||
      surveyType === EXIT_3B_SURVEY_TYPE
    ) {
      await submitForm({
        label: `Exit ${surveyType} form`,
        fixtureFile: "exitSubmission.json",
        formId: env.exitFormId,
        token: getExitFormToken(),
        contactId,
        data: { surveyType },
      });
    } else {
      await submitForm({
        label: "Forestry form",
        fixtureFile: "forestrySubmission.json",
        formId: env.forestryFormId,
        token: getForestryFormToken(),
        contactId,
      });
    }

    console.log(
      "This calls the real update job for every form (welcome, in progress, exit, forestry) and can mark other recipients completed if they submitted in the last 3 days.",
    );
    const attempts = 5;
    let finalRow: RecipientRow | undefined;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      await runUpdateJobs({ historical: false });
      const row = await readRecipient(id);
      if (row.surveyCompleted) {
        finalRow = row;
        break;
      }
      console.log(`surveyCompleted is still false after attempt ${attempt} of ${attempts}`);
      if (attempt < attempts) {
        await sleep(10_000);
      }
    }
    if (finalRow === undefined) {
      throw new Error("surveyCompleted is still false after 5 attempts");
    }

    logRecipient(finalRow);
    process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    if (insertedId !== undefined) {
      console.error(`Recipient id: ${insertedId}`);
    }
    process.exit(1);
  }
}

function parseSurveyType(argv: readonly string[]): string {
  const args = argv.slice(2);
  let surveyType: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === undefined) {
      throw new Error("Missing argument");
    }

    let value: string;
    if (arg === "--survey-type") {
      const next = args[index + 1];
      if (next === undefined) {
        throw new Error("Missing value for --survey-type");
      }
      value = next;
      index += 1;
    } else if (arg.startsWith("--survey-type=")) {
      value = arg.slice("--survey-type=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }

    if (surveyType !== undefined) {
      throw new Error("Duplicate --survey-type");
    }
    surveyType = value;
  }

  if (surveyType === undefined) {
    throw new Error("Missing required argument --survey-type");
  }
  return surveyType;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(`${name} is missing or blank`);
  }
  return value.trim();
}

function ask(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function confirm(question: string, expected: string): Promise<void> {
  const answer = await ask(question);
  if (answer !== expected) {
    throw new Error(`Expected the exact response ${expected}`);
  }
}

async function assertSurveyExists(surveyType: string): Promise<void> {
  const result = await db.query(
    `SELECT "surveyId" FROM api.surveys WHERE "surveyId" = $1`,
    [surveyType],
  );
  if (result.rows.length === 0) {
    throw new Error(`api.surveys has no row with surveyId "${surveyType}"`);
  }
}

async function assertNoMatchingRecipients(): Promise<void> {
  const unsent = await countMatching(
    `SELECT COUNT(*)::int AS count
     FROM api.recipients
     WHERE "emailSent" IS FALSE
       AND "emailError" IS FALSE
       AND "surveyCompleted" IS FALSE`,
  );
  if (unsent !== 0) {
    throw new Error(
      `Pre-flight failed: unsent recipients count is ${unsent}`,
    );
  }

  for (const surveyType of SURVEY_TYPES) {
    for (const interval of REMINDER_INTERVALS) {
      const reminders = await countMatching(
        `SELECT COUNT(*)::int AS count
         FROM api.recipients
         WHERE "surveyCompleted" IS FALSE
           AND "surveyDate" < (NOW() - ($1::int * INTERVAL '1 day'))
           AND "surveyType" = $2
           AND "emailError" IS FALSE
           AND NOT coalesce(reminders::jsonb, '{}'::jsonb) ? $3`,
        [interval.days, surveyType, interval.key],
      );
      if (reminders !== 0) {
        throw new Error(
          `Pre-flight failed: ${interval.key} for survey type ${surveyType} (${interval.days} days) count is ${reminders}`,
        );
      }
    }
  }
}

async function countMatching(
  sql: string,
  params: readonly unknown[] = [],
): Promise<number> {
  const result = await db.query(sql, params);
  const value = result.rows[0]?.count;
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value);
  }
  throw new Error(`Expected a count, received ${String(value)}`);
}

async function allocateContactId(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const value = CONTACT_ID_FLOOR + randomInt(1_000_000_000);
    if (!Number.isSafeInteger(value) || value <= REAL_EMAIL_CONTACT_ID) {
      throw new Error(
        `Generated contactId ${value} is not a safe integer above 555555000`,
      );
    }
    const contactId = String(value);
    const existing = await db.query(
      `SELECT 1 FROM api.recipients WHERE "contactId" = $1`,
      [contactId],
    );
    if (existing.rows.length === 0) {
      return contactId;
    }
  }
  throw new Error("Could not generate a unique contactId after 5 tries");
}

async function readRecipient(id: number): Promise<RecipientRow> {
  const result = await db.query(
    `SELECT *, to_char("surveyDate", 'YYYY-MM-DD') AS "surveyDateText"
     FROM api.recipients
     WHERE id = $1`,
    [id],
  );
  const columns = result.rows[0];
  if (columns === undefined) {
    throw new Error(`Recipient ${id} was not found`);
  }
  const row = parseRecipient(columns);
  if (row.id !== id) {
    throw new Error(`Read recipient ${row.id} while looking for ${id}`);
  }
  return row;
}

function parseRecipient(columns: Record<string, unknown>): RecipientRow {
  return {
    id: parseId(columns.id),
    emailSent: booleanColumn(columns.emailSent, "emailSent"),
    emailError: booleanColumn(columns.emailError, "emailError"),
    emailId: nullableStringColumn(columns.emailId, "emailId"),
    surveyDate: dateText(columns.surveyDateText),
    surveyCompleted: booleanColumn(columns.surveyCompleted, "surveyCompleted"),
    reminders: columns.reminders ?? null,
    columns,
  };
}

async function assertInvite(row: RecipientRow): Promise<string> {
  if (row.emailSent !== true) {
    throw new Error(`emailSent is ${String(row.emailSent)}`);
  }
  if (row.emailError !== false) {
    throw new Error(`emailError is ${String(row.emailError)}`);
  }
  if (row.emailId === null || row.emailId.length === 0) {
    throw new Error("emailId is empty");
  }
  // The cron writes new Date() into a date column, so Postgres picks the day
  // in its session time zone. Compare against the same clock.
  const result = await db.query(
    `SELECT to_char(CURRENT_DATE, 'YYYY-MM-DD') AS today`,
  );
  const today = result.rows[0]?.today;
  if (row.surveyDate !== today) {
    throw new Error(
      `surveyDate ${row.surveyDate ?? "null"} is not the database date ${String(today)}`,
    );
  }
  return row.emailId;
}

function assertReminderEmailId(
  reminders: unknown,
  key: "reminder1" | "reminder2",
): string {
  if (!isRecord(reminders)) {
    throw new Error(
      `reminders.${key}.emailId is missing: ${JSON.stringify(reminders)}`,
    );
  }
  const entry = reminders[key];
  if (!isRecord(entry)) {
    throw new Error(
      `reminders.${key}.emailId is missing: ${JSON.stringify(reminders)}`,
    );
  }
  const emailId = entry.emailId;
  if (typeof emailId !== "string" || emailId.length === 0) {
    throw new Error(
      `reminders.${key}.emailId is missing: ${JSON.stringify(reminders)}`,
    );
  }
  return emailId;
}

function logRecipient(row: RecipientRow): void {
  const printable: Record<string, unknown> = {
    ...row.columns,
    surveyDate: row.surveyDate,
  };
  delete printable.surveyDateText;
  console.log(JSON.stringify(printable, null, 2));
}

function assertOneRow(result: QueryResult, label: string): void {
  if (result.rowCount !== 1) {
    throw new Error(`${label} affected ${String(result.rowCount)} rows`);
  }
}

function parseId(value: unknown): number {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const parsed = Number(value);
    if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  throw new Error(`Expected an integer id, received ${String(value)}`);
}

function booleanColumn(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} is not a boolean`);
  }
  return value;
}

function nullableStringColumn(value: unknown, label: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`${label} is not a string`);
  }
  return value;
}

function dateText(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(
      `surveyDate column is not YYYY-MM-DD: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

void main();
