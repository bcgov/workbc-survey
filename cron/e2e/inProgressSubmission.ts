import { getEnv, getInProgressFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitInProgressForm(contactId: string): Promise<void> {
  await submitForm({
    label: "In-progress form",
    fixtureFile: "inProgressSubmission.json",
    formId: getEnv().inProgressFormId,
    token: getInProgressFormToken(),
    contactId,
  });
}
