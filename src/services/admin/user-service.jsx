import instance from "~/config/Api";

export const getAllUser = async () => {
    const res = await instance.get('admin/user/all')
    return res;
}

export const lockAccount = async (id) => {
    const res = await instance.delete(`admin/user/${id}`);
    return res;
}

export const unlockAccount = async (id) => {
    const res = await instance.put(`admin/user/${id}`);
    return res;
}
