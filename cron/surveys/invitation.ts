import moment from "moment";
import { sendEmail } from "../services/email.service"
import { getRecipients, updateRecipient } from '../services/recipient.service'
import { getSurveyData } from '../services/survey.service';
import { getToken } from '../services/common.service'

let env = process.env.ENVIRONMENT || ''
let emailIntercept = process.env.EMAIL_INTERCEPT || ''

const generateHTMLEmail = require('../../utils/htmlEmail')

export const sendSurvey = async () => {
  let token = await getToken()
  let recipients = await getRecipients()
  //console.log(recipients)
  console.log(`Sending ${recipients.count} survey invites`)
  let counter = 0
  let tokenCounter = 0
  if (recipients.count > 0) {
    for (const recipient of recipients.recipients) {
      //console.log(recipient)
      const survey = await getSurveyData(recipient.surveyType, recipient.language.toUpperCase())
      //console.log(survey)
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
      await sendEmail(
        token as string,
        generateHTMLEmail(survey.email.initial.title,
          survey.email.initial.start,
          survey.email.initial.box,
          survey.email.initial.end
        ),
        survey.email.initial.subject,
        [{
          to: [email],
          delayTS: 0,
          tag: `workbc_survey_${recipient.surveyType}`,
          context: {
            firstName: recipient.firstName,
            surveyLink: survey.surveyLink,
            surveyType: recipient.surveyType,
            contactId: recipient.contactId,
            endDate: recipient.language.toUpperCase() === "FR" ? moment().locale('fr').add(30, 'days').format('LL') : moment().add(30, 'days').format('LL'),
            lastName: recipient.lastName
          }
        }]
      )
        .then(async (emailResult) => {
          await updateRecipient(emailResult, recipient.id, true, false, new Date())
          //wait 1 second
          //console.log("Waiting 1 Second between emails")
          await new Promise(resolve => setTimeout(resolve, 1000));
        })
        .catch(async (error) => {
          console.log(error)
          await updateRecipient("", recipient.id, false, true, null)
        })
      tokenCounter++
      counter++
      //console.log(tokenCounter)
      //refresh token every 400 emails
      if (tokenCounter === 100) {
        console.log("Refreshing token")
        token = await getToken()
        tokenCounter = 0
      }
      console.log(`Progress ${counter}/${recipients.count}`)
    }
  }
}