import moment from "moment";
import { sendEmail } from "../../services/email.service"
import {getRecipients, updateRecipient} from '../../services/recipient.service'
import { getSurveyData } from '../../services/survey.service';

const generateHTMLEmail = require('../../utils/htmlEmail')

export const sendSurvey =  async (token: string) => {
let recipients = await getRecipients()
  //console.log(recipients)
  if (recipients.count > 0){
    for (const recipient of recipients.recipients){
      //console.log(recipient)
      const survey = await getSurveyData(recipient.surveyType, recipient.language.toUpperCase())
      //console.log(survey)
      await sendEmail(
        token,
        generateHTMLEmail(survey.email.initial.title,
            survey.email.initial.start,
            survey.email.initial.box,
            survey.email.initial.end
            ),
        survey.email.initial.subject,
        [{
            to: [recipient.email],
            delayTS: 0,
            tag: "initial_workbc_survey",
            context: {
                firstName: recipient.firstName,
                surveyLink: survey.surveyLink,
                contactId: recipient.contactId,
                endDate: moment().add(30, 'days').format('LL')
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