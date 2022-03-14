const db = require('../db/db');
const format = require('pg-format');

export const getRecipients = async () => {
    let recipients: any
     try{
         await db.query(
             `SELECT * FROM api.recipients WHERE "emailSent" IS FALSE AND "emailError" IS FALSE AND "surveyCompleted" IS FALSE`
           )
         .then((resp: any) => {
             recipients = { count: resp.rowCount, recipients: resp.rows.map((c: any) => {
                 return {
                     id: c.id,
                     firstName: c.firstName,
                     email: c.email,
                     surveyType: c.surveyType,
                     contactId: c.contactId,
                     language: c.language
                 }
             }) };
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return recipients
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }

 export const updateRecipient = async (emailId: string, id: number, emailSent: boolean, emailError: boolean, emailDate: Date | null) => {
    let recipients: any
     try{
         await db.query(
             `UPDATE api.recipients SET "emailId" = $1, "emailSent" = $2, "emailError" = $3, "surveyDate" = $4 WHERE id= $5`,
             [emailId, emailSent, emailError, emailDate, id]
           )
         .then((resp: any) => {
             return resp
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return recipients
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }

 export const updateRecipientSurveyCompletion = async (id: string) => {
    let recipients: any
     try{
         await db.query(
             `UPDATE api.recipients SET "surveyCompleted" = $1 WHERE "contactId" = $2`,
             [true, id]
           )
         .then((resp: any) => {
             return resp
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return recipients
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }

 export const updateRecipientReminder = async (reminder: any, id: string) => {
    let recipients: any
     try{
         await db.query(
             format(`UPDATE api.recipients SET "reminders" = coalesce(reminders::jsonb, '{}'::jsonb) || '%s'::jsonb WHERE id = %L`, reminder, id),
           )
         .then((resp: any) => {
             return resp
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return recipients
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }

 export const getReminderRecipients = async (interval: number, surveyType: number, reminder: string) => {
    let recipients: any
    let query = format(`SELECT * FROM api.recipients WHERE "surveyCompleted" IS FALSE AND "surveyDate" < (NOW() - '%s day'::interval) AND "surveyType" = %L AND "emailError" IS FALSE AND NOT coalesce(reminders::jsonb, '{}'::jsonb) ? %L`,interval, surveyType, reminder)
     try{
         await db.query(query)
         .then((resp: any) => {
             recipients = { count: resp.rowCount, recipients: resp.rows.map((c: any) => {
                 return {
                     id: c.id,
                     firstName: c.firstName,
                     email: c.email,
                     surveyType: c.surveyType,
                     contactId: c.contactId,
                     language: c.language,
                     surveyDate: c.surveyDate
                 }
             }) };
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return recipients
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }