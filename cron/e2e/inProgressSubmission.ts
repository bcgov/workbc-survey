import { getEnv, getInProgressFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitInProgressForm(contactId: string): Promise<void> {
  await submitForm({
    label: "In-progress form",
    fixtureFile: "inProgressSubmission.json",
    formId: getEnv().inProgressFormId,
    token: getInProgressFormToken(),
    contactId,
    versionIdEnv: "E2E_IN_PROGRESS_FORM_VERSION_ID",
  });
}
