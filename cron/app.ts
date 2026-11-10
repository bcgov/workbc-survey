const express = require("express");
const cron = require("node-cron");

import {
  getEnv,
  getExitFormToken,
  getForestryFormToken,
  getInProgressFormToken,
  getIntake1aFormToken,
  getIntakeFormToken,
} from "./config/config";
import { sendSurvey } from "./surveys/invitation";
import { sendReminder } from "./surveys/reminder";
import { updateCompleted } from "./surveys/updateCompleted";
import { isValidHour, isValidMinute } from "./utils/helpers";

const env = getEnv();
const app = express();

let intakeFirstRun = true;
let intake1aFirstRun = true;
let inProgressFirstRun = true;
let exitFirstRun = true;
let forestryFirstRun = true;

// Load custom schedule if exists.
let emailSendHour = env.emailSendHour;
let emailSendMinute = env.emailSendMinute;
let updateHour = env.updateHour;
let updateMinute = env.updateMinute;

if (!isValidHour(emailSendHour) && emailSendHour !== "*") emailSendHour = "10";
if (!isValidMinute(emailSendMinute) && emailSendMinute !== "*")
  emailSendMinute = "0";
if (!isValidHour(updateHour) && updateHour !== "*") updateHour = "9";
if (!isValidMinute(updateMinute) && updateMinute !== "*") updateMinute = "0";

const emailSendSchedule = `${emailSendMinute} ${emailSendHour} * * *`;
const updateSchedule = `${updateMinute} ${updateHour} * * *`;

//Load form info
const intakeMinDate = env.intakeMinDate;
const intakeFormId = env.intakeFormId;
const intakeFormToken = getIntakeFormToken();
const intake1aMinDate = env.intake1aMinDate;
const intake1aFormId = env.intake1aFormId;
const intake1aFormToken = getIntake1aFormToken();
const inProgressMinDate = env.inProgressMinDate;
const inProgressFormId = env.inProgressFormId;
const inProgressFormToken = getInProgressFormToken();
const exitMinDate = env.exitMinDate;
const exitFormId = env.exitFormId;
const exitFormToken = getExitFormToken();
const forestryMinDate = env.forestryMinDate;
const forestryFormId = env.forestryFormId;
const forestryFormToken = getForestryFormToken();

//updates already completed surveys
cron.schedule(
  updateSchedule,
  async function () {
    //get intake forms completed
    await updateCompleted(
      intakeFirstRun,
      intakeMinDate,
      intakeFormId,
      intakeFormToken,
    );
    intakeFirstRun = false;

    //get intake forms completed
    await updateCompleted(
      intake1aFirstRun,
      intake1aMinDate,
      intake1aFormId,
      intake1aFormToken,
    );
    intake1aFirstRun = false;

    //get in progress survey completed
    await updateCompleted(
      inProgressFirstRun,
      inProgressMinDate,
      inProgressFormId,
      inProgressFormToken,
    );
    inProgressFirstRun = false;

    //get exit survey complete
    await updateCompleted(exitFirstRun, exitMinDate, exitFormId, exitFormToken);
    exitFirstRun = false;

    //get forestry survey forms completed
    await updateCompleted(
      forestryFirstRun,
      forestryMinDate,
      forestryFormId,
      forestryFormToken,
    );
    forestryFirstRun = false;
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  },
);

//0 10 * * *
cron.schedule(
  emailSendSchedule,
  async function () {
    //send survey intivations
    await sendSurvey();
    //handle reminder 1
    await sendReminder(14, "1", "reminder1");
    await sendReminder(14, "1a", "reminder1");
    await sendReminder(14, "2", "reminder1");
    await sendReminder(14, "3a", "reminder1");
    await sendReminder(14, "3b", "reminder1");
    await sendReminder(14, "4", "reminder1");
    //handle reminder 2
    await sendReminder(30, "1", "reminder2");
    await sendReminder(30, "1a", "reminder2");
    await sendReminder(30, "2", "reminder2");
    await sendReminder(30, "3a", "reminder2");
    await sendReminder(30, "3b", "reminder2");
    await sendReminder(30, "4", "reminder2");
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  },
);

const port = process.env.PORT || "8001";
app.listen(port, () => {
  console.log(`server started at :${port}`);
});

module.exports = app;
