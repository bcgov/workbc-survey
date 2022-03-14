const express = require('express');
const cron = require('node-cron')
const generateHTMLEmail = require('../utils/htmlEmail')


import {getToken} from './services/common.service'
import {sendEmail} from './services/email.service'
import {getRecipients, updateRecipient} from './services/recipient.service'
import { sendSurvey } from './surveys/intake/invitation';
import { sendReminder } from './surveys/intake/reminder';
import { updateCompleted } from './surveys/intake/updateCompleted';

let env = process.env.ENVIRONMENT || ''

const app = express();

let intakeFirstRun = true
let emailSendSchedule = '0 10 * * *'

if (env === 'DEV' || env === 'TEST'){
  emailSendSchedule = '*/6 * * * *'
}

//
//updates already completed surveys
cron.schedule('0 9 * * *', async function() {
  await updateCompleted(intakeFirstRun)
  intakeFirstRun = false
})

//0 10 * * *
cron.schedule(emailSendSchedule, async function() {
  //await db.query("SET search_path TO 'api;'")
  let token = await getToken()
  //send survey intivations
  await sendSurvey(token as string)
  //handle reminder 1
  await sendReminder(token as string, 14, 1, "reminder1")
  //handle reminder 2
  await sendReminder(token as string, 28, 1, "reminder2")

})


const port = process.env.PORT || '8000';
app.listen( port, () => {
  console.log( `server started at :${ port }` );
} );

module.exports = app;
