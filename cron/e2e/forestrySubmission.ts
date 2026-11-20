import { getEnv, getForestryFormToken } from "../config/config";
import { submitForm } from "./submitForm";

export async function submitForestryForm(contactId: string): Promise<void> {
  await submitForm({
    label: "Forestry form",
    fixtureFile: "forestrySubmission.json",
    formId: getEnv().forestryFormId,
    token: getForestryFormToken(),
    contactId,
  });
}
