import instance from "~/config/Api"

export const getBusinessAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics-overview?filter=${filter}`)
    return response;
}

export const getPaymentMethodAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics-payment-method?filter=${filter}`)
    return response;
}