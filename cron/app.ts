const express = require('express');
const cron = require('node-cron')
const generateHTMLEmail = require('../utils/htmlEmail')


import {getToken} from './services/common.service'
import {sendEmail} from './services/email.service'
import {getRecipients, updateRecipient} from './services/recipient.service'
import { sendSurvey } from './surveys/intake/invitation';
import { sendReminder } from './surveys/intake/reminder';

const app = express();

//0 06 * * *
cron.schedule('* * * * *', async function() {
  //await db.query("SET search_path TO 'api;'")
  let token = await getToken()
  //send survey intivations
  await sendSurvey(token as string)
  //handle reminder 1
  await sendReminder(token as string, 14, 1, "reminder1")
  //handle reminder 2
  await sendReminder(token as string, 28, 1, "reminder2")
  /*
  let recipients = await getRecipients()
  console.log(recipients)
  if (recipients.count > 0){
    let token = await getToken()
    for (const recipient of recipients.recipients){
      console.log(recipient)
      let survey = await getSurveyLink(recipient.surveyType)
      console.log(survey)
      await sendEmail(token as string,generateHTMLEmail(
        "We need your help!",
        [
          `Hello ${recipient.firstName}`,
          `Thank you for using WorkBC Employment Services.`,
          `We're conducting a short survey to hear about your experience with WorkBC so far. Please provide your thoughts, ideas, and feedback as this will help us improve WorkBC for yourself and other British Columbians.`,
          `</p><p>
            <ul>
              <li>The survey will take approximately 2-3 minutes to complete.</li>
              <li>All survey responses are confidential.</li>
            </ul>
          `
        ],
        [],
        [
          `Please <a href="${survey.surveyLink}&uuid=${recipient.contactId}">CLICK HERE</a> to complete the survey by Tuesday, March 1, 2022.`,
          `Thank you in advance for your participation, ${recipient.firstName}. We look forward to hearing from you.`,
          `Sincerely,\nYour WorkBC Team`
        ]
      ),recipient.email,`${recipient.firstName}, we need your feedback on WorkBC services.`)
      .then(async (emailResult) => {
        await updateRecipient(emailResult, recipient.id, true, false)
      })
      .catch(async (error) => {
        console.log(error)
        await updateRecipient("", recipient.id, false, true)
      })
    }
  }
  */
  //console.log("running task")
  //let token = await getToken()
  //console.log(token)

})


const port = process.env.PORT || '8000';
app.listen( port, () => {
  console.log( `server started at :${ port }` );
} );

module.exports = app;
