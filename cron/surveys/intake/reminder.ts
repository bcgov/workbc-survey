import moment from "moment";
import { sendEmail } from "../../services/email.service"
import { getRecipients, getReminderRecipients, updateRecipient, updateRecipientReminder } from '../../services/recipient.service'
import { getSurveyData } from '../../services/survey.service';

const generateHTMLEmail = require('../../utils/htmlEmail')

export const sendReminder = async (token: string, interval: number, surveyType: number, reminder: string) => {
    try {
        let recipients = await getReminderRecipients(interval, surveyType, reminder)
        console.log(recipients)

        if (recipients.count > 0) {
            for (const recipient of recipients.recipients) {
                console.log(recipient)
                const survey = await getSurveyData(recipient.surveyType, recipient.language.toUpperCase())
                //console.log(survey)
                let emailContent
                let result: { reminder1?: any; reminder2?: any; }
                if (interval === 14) {
                    emailContent = survey.email.reminder1
                    result = { "reminder1": {} }
                } else if (interval === 28) {
                    emailContent = survey.email.reminder2
                    result = { "reminder2": {} }
                } else {

                }
                //console.log(emailContent)
                await sendEmail(
                    token,
                    generateHTMLEmail(emailContent.title,
                        emailContent.start,
                        emailContent.box,
                        emailContent.end
                    ),
                    emailContent.subject,
                    [{
                        to: [recipient.email],
                        delayTS: 0,
                        tag: "initial_workbc_survey",
                        context: {
                            firstName: recipient.firstName,
                            surveyLink: survey.surveyLink,
                            contactId: recipient.contactId,
                            endDate: moment(recipient.surveyDate).add(30, 'days').format('LL')
                        }
                    }]
                )
                    .then(async (emailResult) => {
                        if (interval === 14) {
                            result.reminder1 = {
                                "emailId": emailResult,
                                "sentDate": moment().format("YYYY-MM-DD")
                            }
                        } else if (interval === 28) {
                            result.reminder2 = {
                                "emailId": emailResult,
                                "sentDate": moment().format("YYYY-MM-DD")
                            }
                        }

                        await updateRecipientReminder(result, recipient.id)
                    })
                    .catch(async (error) => {
                        console.log(error)
                        //await updateRecipient("", recipient.id, false, true, null)
                    })
            }
        }
    } catch (error: any) {
        console.log(error)
    }

}