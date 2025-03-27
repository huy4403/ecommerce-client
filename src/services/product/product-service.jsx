import instance from "~/config/Api";

export const getProductById = async (id) => {
    const response = await instance.get(`public/product/${id}`);
    return response.data;
}

