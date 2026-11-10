import { getEnv } from "../config/config";

export const exportFormResponse = async(formId: string, formToken: string, minDate: string, maxDate: string) => {
    try {
        const response = await fetch(
            `${getEnv().formsServerUrl}/app/api/v1/forms/${formId}/export?format=json&type=submissions&preference={"minDate":"${minDate}","maxDate":"${maxDate}"}`,
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
