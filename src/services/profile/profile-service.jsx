import instance from "~/config/Api";

export const changePassword = async (data) => {
    const response = await instance.put("user/change-password", data);
    return response.data;
};

export const uploadAvatar = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post("user/upload-avatar", formData);
    return response;
};

export const updateProfile = async (data) => {
    const response = await instance.put("user/update-profile", data);
    return response;
};

export const getProfile = async () => {
    const response = await instance.get("user/profile");
    return response;
};



