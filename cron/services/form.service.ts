import { AxiosResponse } from "axios";

import { formsApi } from "../config/config";

export const exportFormResponse = async(formId: string, formToken: string, minDate: string, maxDate: string) => {
    try {
        const formResponse : AxiosResponse = await formsApi.get(
            `/app/api/v1/forms/${formId}/export?format=json&type=submissions&minDate=${minDate}&maxDate=${maxDate}`, {
                auth: {
                    username: formId,
                    password: formToken
                },
            }
        )
        return formResponse.data
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status)
    }
}