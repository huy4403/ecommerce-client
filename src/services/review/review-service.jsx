import instance from "~/config/Api";

export const getReview = async (id, page, limit) => {
    const response = await instance.get(`public/product/${id}/reviews`, {
        params: {
            page,
            limit,
        },
    });
    return response;
}

export const createReview = async (request) => {
    const response = await instance.post('review', request);
    return response;
}
