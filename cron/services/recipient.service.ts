const db = require('../db/db');

export const getRecipients = async () => {
    let recipients: any
     try{
         await db.query(
             `SELECT * FROM api.names WHERE "emailSent" IS FALSE AND "emailError" IS FALSE`
           )
         .then((resp: any) => {
             recipients = { count: resp.rowCount, recipients: resp.rows.map((c: any) => {
                 return {
                     id: c.id,
                     firstName: c.firstName,
                     email: c.email,
                     surveyType: c.surveyType,
                     contactId: c.contactId
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

 export const updateRecipient = async (emailId: string, id: number, emailSent: boolean, emailError: boolean) => {
    let recipients: any
     try{
         await db.query(
             `UPDATE api.names SET "emailId" = $1, "emailSent" = $2, "emailError" = $3 WHERE id= $4`,
             [emailId, emailSent, emailError, id]
           )
         .then((resp: any) => {
             recipients = { count: resp.rowCount, recipients: resp.rows.map((c: any) => {
                 return {
                     firstName: c.firstName,
                     email: c.email,
                     surveyType: c.surveyType
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