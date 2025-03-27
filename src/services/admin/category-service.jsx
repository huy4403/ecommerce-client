import instance from "~/config/Api";

export const createCategory = async ({ name, parentId }) => {
    const obj = {
        name,
        parentId
    }
    const res = await instance.post('admin/category', obj);
    return res;
}

export const updateCategory = async ({ id, name, parentId }) => {
    const obj = {
        name,
        parentId
    }
    const res = await instance.put(`admin/category/${id}`, obj);
    return res;
}

export const deleteCategory = async ({ id }) => {
    const res = await instance.delete(`admin/category/${id}`);
    return res;
}
