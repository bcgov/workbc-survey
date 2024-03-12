import moment from "moment";
import { sendEmail } from "../services/email.service"
import { getRecipients, getReminderRecipients, updateRecipient, updateRecipientReminder } from '../services/recipient.service'
import { getSurveyData } from '../services/survey.service';
import { getToken } from '../services/common.service'

let env = process.env.ENVIRONMENT || ''
let emailIntercept = process.env.EMAIL_INTERCEPT || ''

const generateHTMLEmail = require('../../utils/htmlEmail')

export const sendReminder = async (interval: number, surveyType: string, reminder: string) => {
    try {
        let token = await getToken()
        let recipients = await getReminderRecipients(interval, surveyType, reminder)
        //console.log(recipients)
        console.log(`Sending ${recipients.count} survey reminder for ${interval} days for ${surveyType}`)
        let counter = 0
        let tokenCounter = 0
        if (recipients.count > 0) {
            for (const recipient of recipients.recipients) {
                //console.log(recipient)
                const survey = await getSurveyData(recipient.surveyType, recipient.language.toUpperCase())
                //console.log(survey)
                let emailContent
                let result: { reminder1?: any; reminder2?: any; }
                if (interval === 14) {
                    emailContent = survey.email.reminder1
                    result = { "reminder1": {} }
                } else if (interval === 30) {
                    emailContent = survey.email.reminder2
                    result = { "reminder2": {} }
                } else {

                }
                let email = ''
                if (env === 'DEV' || env === 'TEST') {
                    if (recipient.contactId > 555555000) {
                        email = recipient.email
                    } else {
                        email = emailIntercept
                    }
                } else {
                    email = recipient.email
                }
                //console.log(emailContent)
                await sendEmail(
                    token as string,
                    generateHTMLEmail(emailContent.title,
                        emailContent.start,
                        emailContent.box,
                        emailContent.end
                    ),
                    emailContent.subject,
                    [{
                        to: [email],
                        delayTS: 0,
                        tag: `workbc_survey_${surveyType}_${reminder}`,
                        context: {
                            firstName: recipient.firstName,
                            surveyLink: survey.surveyLink,
                            surveyType: recipient.surveyType,
                            contactId: recipient.contactId,
                            endDate: recipient.language.toUpperCase() === "FR" ? moment().locale('fr').add(16, 'days').format('LL') : moment().add(16, 'days').format('LL'),
                            lastName: recipient.lastName
                        }
                    }]
                )
                    .then(async (emailResult) => {
                        if (interval === 14) {
                            result.reminder1 = {
                                "emailId": emailResult,
                                "sentDate": moment().format("YYYY-MM-DD")
                            }
                        } else if (interval === 30) {
                            result.reminder2 = {
                                "emailId": emailResult,
                                "sentDate": moment().format("YYYY-MM-DD")
                            }
                        }

                        await updateRecipientReminder(result, recipient.id)
                        //wait 1 second between emails
                        //console.log("Waiting 1 Second between emails")
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    })
                    .catch(async (error) => {
                        console.log(error)
                        //await updateRecipient("", recipient.id, false, true, null)
                    })
                tokenCounter++
                counter++
                //refresh token every 100 emails
                if (tokenCounter === 100) {
                    console.log("Refreshing token")
                    token = await getToken()
                    tokenCounter = 0
                }
                console.log(`Progress ${counter}/${recipients.count}`)
            }
        }
    } catch (error: any) {
        console.log(error)
    }

}