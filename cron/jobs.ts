import { sendSurvey } from "./surveys/invitation";
import { sendReminder } from "./surveys/reminder";
import { updateCompleted } from "./surveys/updateCompleted";
import {
  getUpdateForms,
  REMINDER_INTERVALS,
  SURVEY_TYPES,
  type ReminderDays,
} from "./surveys/catalog";

const updateForms = getUpdateForms();
const completedHistoricalRun = new Set<string>();

export async function runSendSurvey() {
  await sendSurvey();
}

export async function runReminders(days: ReminderDays) {
  const interval = REMINDER_INTERVALS.find((item) => item.days === days);
  if (!interval) {
    throw new Error(`No reminder interval configured for ${days} days`);
  }
  for (const surveyType of SURVEY_TYPES) {
    await sendReminder(days, surveyType, interval.key);
  }
}

export async function runEmailJobs() {
  await runSendSurvey();
  for (const interval of REMINDER_INTERVALS) {
    await runReminders(interval.days);
  }
}

export async function runUpdateJobs(options?: { historical?: boolean }) {
  const historical = options?.historical !== false;
  for (const form of updateForms) {
    const firstRun =
      historical &&
      form.minDate != null &&
      !completedHistoricalRun.has(form.name);
    await updateCompleted(
      firstRun,
      form.minDate ?? "",
      form.formId,
      form.token,
    );
    if (historical && form.minDate != null) {
      completedHistoricalRun.add(form.name);
    }
  }
}
