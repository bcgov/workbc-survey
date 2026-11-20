import { getEnv, getExitFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitExitForm(
  contactId: string,
  surveyType: "3a" | "3b",
): Promise<void> {
  await submitForm({
    label: `Exit ${surveyType} form`,
    fixtureFile: "exitSubmission.json",
    formId: getEnv().exitFormId,
    token: getExitFormToken(),
    contactId,
    data: { surveyType },
  });
}
