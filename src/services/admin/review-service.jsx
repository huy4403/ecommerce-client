import instance from "~/config/Api";

export const getAllReview = (params) => {
    const res = instance.get(`admin/review`, { params: { params } });
    return res;
}

export const changeReviewStatus = (id, status) => {
    const res = instance.put(`admin/review/${id}`, { status: status });
    return res;
}

export const addReply = (id, request) => {
    const res = instance.post(`admin/review/${id}/reply`, request);
    return res;
};