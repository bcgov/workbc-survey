import { AxiosInstance } from "axios";

const axios = require('axios');
const commonServicesURL = process.env.COMMON_SERVICES_URL || ''
const cdogsBaseUrl = process.env.CDOGS_HOST || ''
const chesBaseUrl = process.env.CHES_HOST || ''
const authBaseUrl = process.env.AUTH_KEYCLOAK_SERVER_URL || ''
const formsBaseUrl = process.env.FORMS_SERVER_URL || ''

export const commonServicesApi: AxiosInstance = axios.create(
  {
    baseURL: commonServicesURL
  }
);

export const cdogsApi: AxiosInstance = axios.create(
  {
    baseURL: cdogsBaseUrl
  }
);

export const chesApi: AxiosInstance = axios.create(
  {
    baseURL: chesBaseUrl
  }
);

export const authApi: AxiosInstance = axios.create(
  {
    baseURL: authBaseUrl
  }
);

export const formsApi: AxiosInstance = axios.create(
  {
    baseURL: formsBaseUrl
  }
);

