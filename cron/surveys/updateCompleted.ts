import moment from "moment";
import { exportFormResponse } from "../services/form.service"
import { updateRecipientSurveyCompletion } from "../services/recipient.service";


export const updateCompleted = async (firstRun: boolean, startDate: string, formId: string, formToken: string) => {
    const date = moment()
    let minDate = date.subtract(3,"days").format('YYYY-MM-DD')
    const maxDate = ''
    if (firstRun){
        minDate = startDate
    }
    const responses = await exportFormResponse(formId,formToken,minDate,maxDate)
    for (const response of responses){
        await updateRecipientSurveyCompletion(response.uuid)
    }
}