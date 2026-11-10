import moment from "moment";
import { exportFormResponse } from "../services/form.service"
import { updateRecipientSurveyCompletion } from "../services/recipient.service";


export const updateCompleted = async (firstRun: boolean, startDate: string, formId: string, formToken: string) => {
    let date = moment()
    let minDate = date.subtract(3,"days").format('YYYY-MM-DD')
    let maxDate = ''
    if (firstRun){
        minDate = startDate
    }
    let responses = await exportFormResponse(formId,formToken,minDate,maxDate)
    for (const response of responses){
        await updateRecipientSurveyCompletion(response.uuid)
    }
}