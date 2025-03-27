import instance from "~/config/Api";

export const getDashboard = async () => {
    const response = await instance.get(`admin/dashboard`);
    return response;
}