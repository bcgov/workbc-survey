import { AxiosResponse } from "axios";

const { authApi } = require("../config/config");

export const getToken = async () => {
    try {
        const authURL = `realms/${process.env.COMMON_SERVICES_AUTH_REALM}/protocol/openid-connect/token`;
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        let config = {
            auth: {
                username: process.env.COMMON_SERVICES_CLIENT || "",
                password: process.env.COMMON_SERVICES_CLIENT_SECRET || ""
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const authResponse: AxiosResponse = await authApi.post(authURL, params, config);
        let token: String = authResponse.data.access_token;
        return token
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status);
    }
}