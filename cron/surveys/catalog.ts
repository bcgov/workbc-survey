import {
  getEnv,
  getExitFormToken,
  getForestryFormToken,
  getInProgressFormToken,
  getIntake1aFormToken,
} from "../config/config";

export const REMINDER_INTERVALS = [
  { days: 14, key: "reminder1" },
  { days: 30, key: "reminder2" },
] as const;

export type ReminderDays = (typeof REMINDER_INTERVALS)[number]["days"];

type Env = ReturnType<typeof getEnv>;

type SurveyFormDefinition = {
  name: string;
  surveyTypes: readonly string[];
  minDate?: (env: Env) => string;
  formId: (env: Env) => string;
  token: () => string;
};

const surveyForms: readonly SurveyFormDefinition[] = [
  {
    name: "welcome",
    surveyTypes: ["1a"],
    minDate: (env) => env.intake1aMinDate,
    formId: (env) => env.intake1aFormId,
    token: getIntake1aFormToken,
  },
  {
    name: "inProgress",
    surveyTypes: ["2"],
    minDate: (env) => env.inProgressMinDate,
    formId: (env) => env.inProgressFormId,
    token: getInProgressFormToken,
  },
  {
    name: "exit",
    surveyTypes: ["3a", "3b"],
    minDate: (env) => env.exitMinDate,
    formId: (env) => env.exitFormId,
    token: getExitFormToken,
  },
  {
    name: "forestry",
    surveyTypes: ["4"],
    minDate: (env) => env.forestryMinDate,
    formId: (env) => env.forestryFormId,
    token: getForestryFormToken,
  },
];

export const SURVEY_TYPES: readonly string[] = surveyForms.flatMap(
  (form) => form.surveyTypes,
);

export type UpdateForm = {
  name: string;
  surveyTypes: readonly string[];
  minDate?: string;
  formId: string;
  token: string;
};

export function getUpdateForms(): UpdateForm[] {
  const env = getEnv();
  return surveyForms.map((form) => ({
    name: form.name,
    surveyTypes: form.surveyTypes,
    minDate: form.minDate?.(env),
    formId: form.formId(env),
    token: form.token(),
  }));
}
