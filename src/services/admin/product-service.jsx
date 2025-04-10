import instance from "~/config/Api";

export const productManagementService = async (request) => {
    const response = await instance.get('admin/product', {
        params: request,
    });
    return response;
}

export const getProductById = async (id) => {
    const response = await instance.get(`admin/product/${id}`);
    return response;
}

export const updateProduct = async (id, request) => {
    const response = await instance.put(`admin/product/${id}`, request);
    return response;
}

export const deleteProduct = async (id, request) => {
    const response = await instance.delete(`admin/product/${id}/image`,
        { params: { fileToRemove: request } }
    );
    return response;
}

export const activeProduct = async (id) => {
    const response = await instance.put(`admin/product/${id}/active`);
    return response;
}

export const inactiveProduct = async (id) => {
    const response = await instance.delete(`admin/product/${id}`);
    return response;
}

export const createProduct = async (request) => {
    const response = await instance.post('admin/product', request);
    return response;
}

export const getAttribute = async (id) => {
    const response = await instance.get(`admin/product-attribute/get-all`, {
        params: {
            productId: id
        }
    });
    return response;
}

export const addAttribute = async (id, name) => {
    const response = await instance.post(`admin/product-attribute`, { productId: id, name });
    return response;
}

export const getVariants = async (id) => {
    const response = await instance.get(`admin/product-variant/${id}`);
    return response;
}

export const addVariant = async (variant) => {
    const response = await instance.post(`admin/product-variant`, variant);
    return response;
}

export const deleteVariant = async (id) => {
    const response = await instance.delete(`admin/product-variant/${id}`);
    return response;
}

export const activeVariant = async (id) => {
    const response = await instance.put(`admin/product-variant/${id}/active`);
    return response;
}

export const updateQuantityVariant = async (id, quantity) => {
    const response = await instance.put(`admin/product-variant/${id}`, { quantity });
    return response;
}



