import { getEnv, getIntake1aFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitWelcomeForm(contactId: string): Promise<void> {
  await submitForm({
    label: "Welcome form",
    fixtureFile: "welcomeSubmission.json",
    formId: getEnv().intake1aFormId,
    token: getIntake1aFormToken(),
    contactId,
    versionIdEnv: "E2E_WELCOME_FORM_VERSION_ID",
  });
}
