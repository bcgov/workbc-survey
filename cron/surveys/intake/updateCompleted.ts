import moment from "moment";
import { exportFormResponse } from "../../services/form.servicee";
import { updateRecipientSurveyCompletion } from "../../services/recipient.service";

let intakeMinDate = process.env.INTAKE_MIN_DATE || '2022-02-28'
let intakeFormId = process.env.INTAKE_FORM_ID || ''
let intakeFormToken = process.env.INTAKE_FORM_TOKEN || ''

export const updateCompleted = async (intakeFirstRun: boolean) => {
    console.log(intakeFirstRun)
    let date = moment()
    let minDate = date.subtract(3,"days").format('YYYY-MM-DD')
    let maxDate = ''
    if (intakeFirstRun){
        minDate = intakeMinDate
    }
    let responses = await exportFormResponse(intakeFormId,intakeFormToken,minDate,maxDate)
    for (const response of responses){
        //console.log(response)
        await updateRecipientSurveyCompletion(response.uuid)
    }
}