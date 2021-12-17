const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const csrf = require('csurf')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http');
const cron = require('node-cron')
const db = require('../db/db');

import {getToken} from './services/common.service'
import {sendEmail} from './services/email.service'
import {getRecipients, updateRecipient} from './services/recipient.service'

const app = express();

console.log(process.env.CHES_HOST)

cron.schedule('*/1 * * * *', async function() {
  //await db.query("SET search_path TO 'api;'")
  let recipients = await getRecipients()
  console.log(recipients)
  if (recipients.count > 0){
    let token = await getToken()
    for (const recipient of recipients.recipients){
      let emailResult = await sendEmail(token as string,`<h1>Survey Invitation</h1>`,recipient.email,'Survey Invitation')
      await updateRecipient(emailResult, recipient.id)
    }
  }
  //console.log("running task")
  //let token = await getToken()
  //console.log(token)

})


const port = process.env.PORT || '8000';
app.listen( port, () => {
  console.log( `server started at :${ port }` );
} );

module.exports = app;
