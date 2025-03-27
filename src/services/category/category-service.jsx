import instance from "~/config/Api";

export const getAllCategory = async () => {
    const res = await instance.get('public/category/get-all');
    return res;
}
export const getAllCategoryAdmin = async (id) => {
    const obj = {
        id: id
    }
    const res = await instance.get('admin/category', { params: obj });
    return res;
}

export const getCategoryById = async (id) => {
    const res = await instance.get(`admin/category/${id}`);
    return res;
}
