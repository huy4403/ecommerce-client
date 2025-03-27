import instance from "~/config/Api";
export const getAllOrders = async () => {
    const response = await instance.get('admin/order');
    return response;
};

export const updateOrderStatus = async (id, newStatus) => {
    const response = await instance.put(`admin/order/${id}`, { orderStatus: newStatus });
    return response;
};

export const updateTransactionStatus = async (id, newStatus) => {
    const response = await instance.put(`admin/order/${id}/transaction`, { status: newStatus });
    return response;
};

export const getOrderById = async (id) => {
    const response = await instance.get(`admin/order/${id}`);
    return response;
};
