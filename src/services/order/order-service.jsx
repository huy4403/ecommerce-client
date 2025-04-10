import instance from "~/config/Api";

export const createOrder = async (order) => {
    const response = await instance.post('order', order);
    return response;
}

export const getOrderById = async (id) => {
    const response = await instance.get(`order/${id}`);
    return response;
}

export const getUserOrders = async () => {
    const response = await instance.get('order');
    return response;
}

export const rePayment = async (id) => {
    const response = await instance.post(`order/${id}`);
    return response;
}


