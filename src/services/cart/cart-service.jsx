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
