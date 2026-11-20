import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { getEnv } from "../config/config";

type SubmissionFixture = {
  submission: {
    data: { uuid: string; [key: string]: unknown };
    metadata: { origin: string };
  };
};

type SubmitFormOptions = {
  label: string;
  fixtureFile: string;
  formId: string;
  token: string;
  contactId: string;
  data?: Record<string, unknown>;
};

export async function submitForm(options: SubmitFormOptions): Promise<void> {
  const base = formsServerBase();
  const versionId = await resolveVersionId(base, options);
  const url = `${base}/app/api/v1/forms/${encodeURIComponent(options.formId)}/versions/${encodeURIComponent(versionId)}/submissions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildSubmission(options)),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `${options.label} submission failed with HTTP ${response.status}: ${text}`,
    );
  }
  console.log(`${options.label} submission status ${response.status}`);
}

function buildSubmission(options: SubmitFormOptions): SubmissionFixture {
  const fixture = JSON.parse(
    readFileSync(fixturePath(options.fixtureFile), "utf8"),
  ) as SubmissionFixture;
  Object.assign(fixture.submission.data, options.data);
  fixture.submission.data.uuid = options.contactId;
  fixture.submission.metadata.origin = formsServerBase();
  return fixture;
}

// tsc does not copy the JSON into dist. The e2e process runs from dist/e2e.
function fixturePath(fixtureFile: string): string {
  const besideModule = path.join(__dirname, fixtureFile);
  if (existsSync(besideModule)) {
    return besideModule;
  }
  return path.join(__dirname, "..", "..", "e2e", fixtureFile);
}

function formsServerBase(): string {
  return getEnv().formsServerUrl.replace(/\/+$/, "");
}

async function resolveVersionId(
  base: string,
  options: SubmitFormOptions,
): Promise<string> {
  const authorization = `Basic ${Buffer.from(`${options.formId}:${options.token}`).toString("base64")}`;
  const formUrl = `${base}/app/api/v1/forms/${encodeURIComponent(options.formId)}`;
  const fromForm = await fetchPublishedVersion(options.label, formUrl, authorization);
  if (fromForm !== undefined) {
    return fromForm;
  }

  const fromVersions = await fetchPublishedVersion(
    `${options.label} versions`,
    `${formUrl}/versions`,
    authorization,
  );
  if (fromVersions !== undefined) {
    return fromVersions;
  }

  throw new Error(
    `No published ${options.label} version was returned by the forms API.`,
  );
}

async function fetchPublishedVersion(
  label: string,
  url: string,
  authorization: string,
): Promise<string | undefined> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: authorization,
    },
  });
  if (!response.ok) {
    console.log(`${label} HTTP ${response.status}`);
    await response.text();
    return undefined;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    console.log(`${label} response was not JSON`);
    return undefined;
  }

  const versionId = publishedVersionId(body);
  if (versionId === undefined) {
    console.log(`${label} has no published version`);
  }
  return versionId;
}

function publishedVersionId(body: unknown): string | undefined {
  const versions = versionEntries(body);
  if (versions === undefined) {
    return undefined;
  }
  for (const entry of versions) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    if (
      record.published === true &&
      typeof record.id === "string" &&
      record.id.length > 0
    ) {
      return record.id;
    }
  }
  return undefined;
}

function versionEntries(body: unknown): unknown[] | undefined {
  if (Array.isArray(body)) {
    return body;
  }
  if (typeof body === "object" && body !== null) {
    const versions = (body as Record<string, unknown>).versions;
    if (Array.isArray(versions)) {
      return versions;
    }
  }
  return undefined;
}
