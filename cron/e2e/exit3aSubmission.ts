import { getEnv, getExitFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitExit3aForm(contactId: string): Promise<void> {
  await submitForm({
    label: "Exit 3a form",
    fixtureFile: "exit3aSubmission.json",
    formId: getEnv().exitFormId,
    token: getExitFormToken(),
    contactId,
    versionIdEnv: "E2E_EXIT_3A_FORM_VERSION_ID",
  });
}
