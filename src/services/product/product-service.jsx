import instance from "~/config/Api";

export const getProductById = async (id) => {
    const response = await instance.get(`public/product/${id}`);
    return response;
}

export const getNewProduct = async () => {
    const response = await instance.get('public/product/get-new');
    return response;
}

export const getFeaturedProduct = async () => {
    const response = await instance.get('public/product/featured');
    return response;
}

export const FetchProducts = async (request) => {
    const res = await instance.get('public/product', {
        params: request,
    });

    return res;
}


