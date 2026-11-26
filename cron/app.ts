const cron = require("node-cron");

import { createApp } from "./api/createApp";
import { getEnv } from "./config/config";
import { runEmailJobs, runUpdateJobs } from "./jobs";
import { isValidHour, isValidMinute } from "./utils/helpers";

const env = getEnv();
const app = createApp();

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

//updates already completed surveys
cron.schedule(
  updateSchedule,
  async function () {
    await runUpdateJobs();
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
    await runEmailJobs();
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  },
);

const port = env.port;
app.listen(port, () => {
  console.log(`server started at :${port}`);
});

module.exports = app;
