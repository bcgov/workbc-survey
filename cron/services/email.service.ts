import { AxiosResponse } from "axios";

import { chesApi } from "../config/config"

const emailBCC = process.env.EMAIL_BCC || ""

export const sendEmail = async (token: string, body: string, email: string, subject: string) => {
    try {
        let request = {
            bcc: [],
            bodyType: "html",
            body: body,
            cc: [],
            delayTs: 0,
            encoding: "utf-8",
            from: "WorkBC Survey <donotreply@gov.bc.ca>",
            priority: "normal",
            subject: subject,
            to: [email],
            tag: `email_workbc_survey`,
            attachments: [],
        }
        const sendEmailResult: AxiosResponse = await chesApi.post(
            'api/v1/email',
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
        //console.log(error)
        throw new Error(error.response?.status);
    }
}