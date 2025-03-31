import instance from "~/config/Api";

export const getAllAddress = async () => {
    const response = await instance.get('address/get-all');
    return response;
}

export const createAddress = async (address) => {
    const response = await instance.post('address', address);
    return response;
}

