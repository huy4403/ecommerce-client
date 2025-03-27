import instance from "~/config/Api"

export const getBusinessAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics/summary?filter=${filter}`)
    return response;
}

export const getPaymentMethodAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics/payments?filter=${filter}`)
    return response;
}

export const getOrderStatusAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics/orders?filter=${filter}`)
    return response;
}

export const getProductAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics/products?filter=${filter}`)
    return response;
}

export const getRevenueAnalytics = async (filter) => {
    const response = await instance.get(`admin/business-analytics/revenue?filter=${filter}`)
    return response;
}


