import instance from "~/config/Api";

export const getAllAddress = async () => {
    const response = await instance.get('address/get-all');
    return response;
}

export const createAddress = async (address) => {
    const response = await instance.post('address', address);
    return response;
}

export const deleteAddress = async (id) => {
    const response = await instance.delete(`address/${id}`);
    return response;
}

export const updateAddress = async (id, address) => {
    const response = await instance.put(`address/${id}`, address);
    return response;
}



