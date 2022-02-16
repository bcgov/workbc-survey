import { AxiosResponse } from "axios";

import { chesApi } from "../config/config"

const emailBCC = process.env.EMAIL_BCC || ""

export const sendEmail = async (token: string, body: string, subject: string, contexts: any) => {
    try {
        let request = {
            //bcc: [],
            bodyType: "html",
            body: body,
            contexts: contexts,
            //cc: [],
            //delayTs: 0,
            encoding: "utf-8",
            from: "WorkBC Survey <noreply-workbcsurvey@gov.bc.ca>",
            priority: "normal",
            subject: subject,
            //to: [email],
            //tag: tag,
            attachments: [],
        }
        console.log(request)
        const sendEmailResult: AxiosResponse = await chesApi.post(
            'api/v1/emailMerge',
            request,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        console.log(sendEmailResult.data)
        return sendEmailResult.data.messages[0].msgId
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status);
    }
}