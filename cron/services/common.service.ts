import { getCommonServicesClientSecret, getEnv } from "../config/config";

export const getToken = async () => {
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        const env = getEnv();
        const username = env.commonServicesClient;
        const password = getCommonServicesClientSecret();
        const response = await fetch(
            `${env.authKeycloakServerUrl}/realms/${env.commonServicesAuthRealm}/protocol/openid-connect/token`,
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            }
        );
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        const authResponse = await response.json();
        const token: string = authResponse.access_token;
        return token
    } catch (error) {
        console.log(error)
        throw error;
    }
}
