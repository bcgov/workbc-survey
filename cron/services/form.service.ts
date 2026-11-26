import { getEnv } from "../config/config";

export const exportFormResponse = async(formId: string, formToken: string, minDate: string, maxDate: string) => {
    try {
        const url = new URL(`${getEnv().formsServerUrl}/app/api/v1/forms/${encodeURIComponent(formId)}/export`)
        url.searchParams.set("format", "json")
        url.searchParams.set("type", "submissions")
        url.searchParams.set("preference", JSON.stringify({ minDate, maxDate }))
        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization: `Basic ${Buffer.from(`${formId}:${formToken}`).toString("base64")}`,
                },
            }
        )
        if (!response.ok) {
            throw new Error(String(response.status))
        }
        return await response.json()
    } catch (error) {
        console.log(error)
        throw error
    }
}
