import instance from "~/config/Api"

export const getCartCount = async () => {
    const response = await instance.get("cart/count");
    return response;
}


export const addToCart = async (productVariantId) => {
    const response = await instance.post("cart", {
        productVariantId
    });
    return response;
}

export const getUserCart = async () => {
    const response = await instance.get("cart");
    return response;
}

export const deleteCartItem = async (id) => {
    const response = await instance.delete(`cart/${id}`);
    return response;
}

export const updateCartItemQuantity = async (id, quantity) => {
    const response = await instance.put(`cart/${id}`, {
        quantity
    });
    return response;
}


