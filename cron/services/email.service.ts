import { getEnv } from "../config/config"

export const sendEmail = async (token: string, body: string, subject: string, contexts: any) => {
    try {
        const request = {
            bodyType: "html",
            body: body,
            contexts: contexts,
            encoding: "utf-8",
            from: "WorkBC Survey <noreply-workbcsurvey@gov.bc.ca>",
            priority: "normal",
            subject: subject,
            attachments: [],
        }
        const response = await fetch(`${getEnv().chesHost}/api/v1/emailMerge`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        })
        if (!response.ok) {
            throw new Error(String(response.status))
        }
        const sendEmailResult = await response.json()
        return sendEmailResult.messages[0].msgId
    } catch (error) {
        console.log(error)
        throw error;
    }
}
