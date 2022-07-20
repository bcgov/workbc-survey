import moment from "moment";
import { exportFormResponse } from "../services/form.service"
import { updateRecipientSurveyCompletion } from "../services/recipient.service";


export const updateCompleted = async (firstRun: boolean, startDate: string, formId: string, formToken: string) => {
    console.log(`Updating survey completion for ${formId}`)
    //console.log(firstRun)
    let date = moment()
    let minDate = date.subtract(3,"days").format('YYYY-MM-DD')
    let maxDate = ''
    if (firstRun){
        minDate = startDate
    }
    let responses = await exportFormResponse(formId,formToken,minDate,maxDate)
    for (const response of responses){
        //console.log(response.uuid)
        await updateRecipientSurveyCompletion(response.uuid)
    }
}