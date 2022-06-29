import moment from "moment";
import { sendEmail } from "../../services/email.service"
import {getRecipients, updateRecipient} from '../../services/recipient.service'
import { getSurveyData } from '../../services/survey.service';

let env = process.env.ENVIRONMENT || ''
let emailIntercept = process.env.EMAIL_INTERCEPT || ''

const generateHTMLEmail = require('../../utils/htmlEmail')

export const sendSurvey =  async (token: string) => {
let recipients = await getRecipients()
  //console.log(recipients)
  if (recipients.count > 0){
    for (const recipient of recipients.recipients){
      //console.log(recipient)
      const survey = await getSurveyData(recipient.surveyType, recipient.language.toUpperCase())
      //console.log(survey)
      let email = ''
      if (env === 'DEV' || env === 'TEST'){
        if (recipient.contactId > 555555000){
          email = recipient.email
        } else {
          email = emailIntercept
        }
      } else {
        email = recipient.email
      }
      await sendEmail(
        token,
        generateHTMLEmail(survey.email.initial.title,
            survey.email.initial.start,
            survey.email.initial.box,
            survey.email.initial.end
            ),
        survey.email.initial.subject,
        [{
            to: [email],
            delayTS: 0,
            tag: "initial_workbc_survey",
            context: {
                firstName: recipient.firstName,
                surveyLink: survey.surveyLink,
                surveyType: recipient.surveyType,
                contactId: recipient.contactId,
                endDate: recipient.language.toUpperCase() === "FR" ?  moment().locale('fr').add(30, 'days').format('LL') :  moment().add(30, 'days').format('LL')
            }
        }]
      )
      .then(async (emailResult) => {
        await updateRecipient(emailResult, recipient.id, true, false, new Date())
      })
      .catch(async (error) => {
        console.log(error)
        await updateRecipient("", recipient.id, false, true, null)
      })
    }
  }
}