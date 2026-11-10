export function getEnv() {
  const envs = {
    AUTH_KEYCLOAK_SERVER_URL: process.env.AUTH_KEYCLOAK_SERVER_URL,
    COMMON_SERVICES_CLIENT: process.env.COMMON_SERVICES_CLIENT,
    COMMON_SERVICES_AUTH_REALM: process.env.COMMON_SERVICES_AUTH_REALM,
    CHES_HOST: process.env.CHES_HOST,
    FORMS_SERVER_URL: process.env.FORMS_SERVER_URL,
    PGHOST: process.env.PGHOST,
    PGPORT: process.env.PGPORT,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGDATABASE: process.env.PGDATABASE,
    ENVIRONMENT: process.env.ENVIRONMENT,
    EMAIL_INTERCEPT: process.env.EMAIL_INTERCEPT,
    STATIC_URL: process.env.STATIC_URL,
    EMAIL_SEND_HOUR: process.env.EMAIL_SEND_HOUR,
    EMAIL_SEND_MINUTE: process.env.EMAIL_SEND_MINUTE,
    UPDATE_HOUR: process.env.UPDATE_HOUR,
    UPDATE_MINUTE: process.env.UPDATE_MINUTE,
    PORT: process.env.PORT,
    INTAKE_MIN_DATE: process.env.INTAKE_MIN_DATE,
    INTAKE_FORM_ID: process.env.INTAKE_FORM_ID,
    INTAKE_1A_MIN_DATE: process.env.INTAKE_1A_MIN_DATE,
    INTAKE_1A_FORM_ID: process.env.INTAKE_1A_FORM_ID,
    IN_PROGRESS_MIN_DATE: process.env.IN_PROGRESS_MIN_DATE,
    IN_PROGRESS_FORM_ID: process.env.IN_PROGRESS_FORM_ID,
    EXIT_MIN_DATE: process.env.EXIT_MIN_DATE,
    EXIT_FORM_ID: process.env.EXIT_FORM_ID,
    FORESTRY_MIN_DATE: process.env.FORESTRY_MIN_DATE,
    FORESTRY_FORM_ID: process.env.FORESTRY_FORM_ID,
  }

  if (!envs.AUTH_KEYCLOAK_SERVER_URL) {
    throw new Error('Failed to get environment variable AUTH_KEYCLOAK_SERVER_URL')
  }
  if (!envs.COMMON_SERVICES_CLIENT) {
    throw new Error('Failed to get environment variable COMMON_SERVICES_CLIENT')
  }
  if (!envs.COMMON_SERVICES_AUTH_REALM) {
    throw new Error('Failed to get environment variable COMMON_SERVICES_AUTH_REALM')
  }
  if (!envs.CHES_HOST) {
    throw new Error('Failed to get environment variable CHES_HOST')
  }
  if (!envs.FORMS_SERVER_URL) {
    throw new Error('Failed to get environment variable FORMS_SERVER_URL')
  }
  if (!envs.PGHOST) {
    throw new Error('Failed to get environment variable PGHOST')
  }
  if (!envs.PGPORT) {
    throw new Error('Failed to get environment variable PGPORT')
  }
  if (!envs.PGUSER) {
    throw new Error('Failed to get environment variable PGUSER')
  }
  if (!envs.PGPASSWORD) {
    throw new Error('Failed to get secret PGPASSWORD')
  }
  if (!envs.PGDATABASE) {
    throw new Error('Failed to get environment variable PGDATABASE')
  }
  if (!envs.ENVIRONMENT) {
    throw new Error('Failed to get environment variable ENVIRONMENT')
  }
  if (!envs.EMAIL_INTERCEPT) {
    throw new Error('Failed to get environment variable EMAIL_INTERCEPT')
  }
  if (!envs.STATIC_URL) {
    throw new Error('Failed to get environment variable STATIC_URL')
  }
  if (!envs.EMAIL_SEND_HOUR) {
    throw new Error('Failed to get environment variable EMAIL_SEND_HOUR')
  }
  if (!envs.EMAIL_SEND_MINUTE) {
    throw new Error('Failed to get environment variable EMAIL_SEND_MINUTE')
  }
  if (!envs.UPDATE_HOUR) {
    throw new Error('Failed to get environment variable UPDATE_HOUR')
  }
  if (!envs.UPDATE_MINUTE) {
    throw new Error('Failed to get environment variable UPDATE_MINUTE')
  }
  if (!envs.PORT) {
    throw new Error('Failed to get environment variable PORT')
  }
  if (!envs.INTAKE_MIN_DATE) {
    throw new Error('Failed to get environment variable INTAKE_MIN_DATE')
  }
  if (!envs.INTAKE_FORM_ID) {
    throw new Error('Failed to get environment variable INTAKE_FORM_ID')
  }
  if (!envs.INTAKE_1A_MIN_DATE) {
    throw new Error('Failed to get environment variable INTAKE_1A_MIN_DATE')
  }
  if (!envs.INTAKE_1A_FORM_ID) {
    throw new Error('Failed to get environment variable INTAKE_1A_FORM_ID')
  }
  if (!envs.IN_PROGRESS_MIN_DATE) {
    throw new Error('Failed to get environment variable IN_PROGRESS_MIN_DATE')
  }
  if (!envs.IN_PROGRESS_FORM_ID) {
    throw new Error('Failed to get environment variable IN_PROGRESS_FORM_ID')
  }
  if (!envs.EXIT_MIN_DATE) {
    throw new Error('Failed to get environment variable EXIT_MIN_DATE')
  }
  if (!envs.EXIT_FORM_ID) {
    throw new Error('Failed to get environment variable EXIT_FORM_ID')
  }
  if (!envs.FORESTRY_MIN_DATE) {
    throw new Error('Failed to get environment variable FORESTRY_MIN_DATE')
  }
  if (!envs.FORESTRY_FORM_ID) {
    throw new Error('Failed to get environment variable FORESTRY_FORM_ID')
  }

  return {
    authKeycloakServerUrl: envs.AUTH_KEYCLOAK_SERVER_URL,
    commonServicesClient: envs.COMMON_SERVICES_CLIENT,
    commonServicesAuthRealm: envs.COMMON_SERVICES_AUTH_REALM,
    chesHost: envs.CHES_HOST,
    formsServerUrl: envs.FORMS_SERVER_URL,
    pgHost: envs.PGHOST,
    pgPort: envs.PGPORT,
    pgUser: envs.PGUSER,
    pgDatabase: envs.PGDATABASE,
    environment: envs.ENVIRONMENT,
    emailIntercept: envs.EMAIL_INTERCEPT,
    staticUrl: envs.STATIC_URL,
    emailSendHour: envs.EMAIL_SEND_HOUR,
    emailSendMinute: envs.EMAIL_SEND_MINUTE,
    updateHour: envs.UPDATE_HOUR,
    updateMinute: envs.UPDATE_MINUTE,
    port: envs.PORT,
    intakeMinDate: envs.INTAKE_MIN_DATE,
    intakeFormId: envs.INTAKE_FORM_ID,
    intake1aMinDate: envs.INTAKE_1A_MIN_DATE,
    intake1aFormId: envs.INTAKE_1A_FORM_ID,
    inProgressMinDate: envs.IN_PROGRESS_MIN_DATE,
    inProgressFormId: envs.IN_PROGRESS_FORM_ID,
    exitMinDate: envs.EXIT_MIN_DATE,
    exitFormId: envs.EXIT_FORM_ID,
    forestryMinDate: envs.FORESTRY_MIN_DATE,
    forestryFormId: envs.FORESTRY_FORM_ID,
  }
}

export function getCommonServicesClientSecret(): string {
  const secret = process.env.COMMON_SERVICES_CLIENT_SECRET
  if (!secret) {
    throw new Error('Failed to get secret COMMON_SERVICES_CLIENT_SECRET')
  }
  return secret
}

export function getIntakeFormToken(): string {
  const secret = process.env.INTAKE_FORM_TOKEN
  if (!secret) {
    throw new Error('Failed to get secret INTAKE_FORM_TOKEN')
  }
  return secret
}

export function getIntake1aFormToken(): string {
  const secret = process.env.INTAKE_1A_FORM_TOKEN
  if (!secret) {
    throw new Error('Failed to get secret INTAKE_1A_FORM_TOKEN')
  }
  return secret
}

export function getInProgressFormToken(): string {
  const secret = process.env.IN_PROGRESS_FORM_TOKEN
  if (!secret) {
    throw new Error('Failed to get secret IN_PROGRESS_FORM_TOKEN')
  }
  return secret
}

export function getExitFormToken(): string {
  const secret = process.env.EXIT_FORM_TOKEN
  if (!secret) {
    throw new Error('Failed to get secret EXIT_FORM_TOKEN')
  }
  return secret
}

export function getForestryFormToken(): string {
  const secret = process.env.FORESTRY_FORM_TOKEN
  if (!secret) {
    throw new Error('Failed to get secret FORESTRY_FORM_TOKEN')
  }
  return secret
}
