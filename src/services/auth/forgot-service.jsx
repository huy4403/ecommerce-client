import instance from "~/config/Api";

export const sendForgotPasswordOTP = async (data) => {
    const response = await instance.post("auth/sent-reset-password-otp", data);
    return response;
};

export const verifyForgotPasswordOTP = async (data) => {
    const response = await instance.put("auth/reset-password-with-otp", data);
    return response;
};
