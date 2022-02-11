const db = require('../db/db');

export const getSurveyLink = async (surveyId: number) => {
    console.log(surveyId)
    let survey: any
     try{
         await db.query(
             `SELECT * FROM api.surveys WHERE "surveyId" = $1`,
             [surveyId]
           )
         .then((resp: any) => {
             survey = { count: resp.rowCount, result: resp.rows.map((c: any) => {
                 return {
                     id: c.id,
                     surveyId: c.surveyId,
                     surveyLink: c.surveyLink
                 }
             }) };
         })
         .catch((err: any) => {
             console.error("error while querying: ", err);
             throw new Error(err.message);
           });
           
     return survey.result[0]
         
     } catch(e: any) {
         console.log(e);
         throw new Error(e.response?.status);
     }
 }