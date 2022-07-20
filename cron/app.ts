const express = require('express');
const cron = require('node-cron')

import { sendSurvey } from './surveys/invitation';
import { sendReminder } from './surveys/reminder';
import { updateCompleted } from './surveys/updateCompleted';

let env = process.env.ENVIRONMENT || ''

const app = express();

let intakeFirstRun = true
let inProgressFirstRun = true
let exitFirstRun = true
let emailSendSchedule = '0 10 * * *'

//Load form info
let intakeMinDate = process.env.INTAKE_MIN_DATE || '2022-02-28'
let intakeFormId = process.env.INTAKE_FORM_ID || ''
let intakeFormToken = process.env.INTAKE_FORM_TOKEN || ''
let inProgressMinDate = process.env.IN_PROGRESS_MIN_DATE || '2022-07-01'
let inProgressFormId = process.env.IN_PROGRESS_FORM_ID || ''
let inProgressFormToken = process.env.IN_PROGRESS_FORM_TOKEN || ''
let exitMinDate = process.env.EXIT_MIN_DATE || '2022-07-01'
let exitFormId = process.env.EXIT_FORM_ID || ''
let exitFormToken = process.env.EXIT_FORM_TOKEN || ''

if (env === 'DEV' || env === 'TEST'){
  emailSendSchedule = '0 * * * *'
}

//
//updates already completed surveys
cron.schedule('0 9 * * *', async function() {
  //get intake forms completed
  await updateCompleted(intakeFirstRun, intakeMinDate, intakeFormId, intakeFormToken)
  intakeFirstRun = false
  //get in progress survey completed
  await updateCompleted(inProgressFirstRun, inProgressMinDate, inProgressFormId, inProgressFormToken)
  inProgressFirstRun = false  
  //get exit survey complete
  await updateCompleted(exitFirstRun, exitMinDate, exitFormId, exitFormToken)
  exitFirstRun = false  
}, {
  scheduled: true,
  timezone: 'America/Los_Angeles'
})

//0 10 * * *
cron.schedule(emailSendSchedule, async function() {
  //await db.query("SET search_path TO 'api;'")
  //let token = await getToken()
  //send survey intivations
  await sendSurvey()
  //handle reminder 1
  await sendReminder(14, "1", "reminder1")
  await sendReminder(14, "2", "reminder1")
  await sendReminder(14, "3a", "reminder1")
  await sendReminder(14, "3b", "reminder1")
  //handle reminder 2
  await sendReminder(30, "1", "reminder2")
  await sendReminder(30, "2", "reminder2")
  await sendReminder(30, "3a", "reminder2")
  await sendReminder(30, "3b", "reminder2")

}, {
  scheduled: true,
  timezone: 'America/Los_Angeles'
})


const port = process.env.PORT || '8000';
app.listen( port, () => {
  console.log( `server started at :${ port }` );
} );

module.exports = app;
