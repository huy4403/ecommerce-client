import instance from "~/config/Api";

export const loginWithPassword = async ({ email, password }) => {
    const objData = { email, password }
    const res = await instance.post('auth/signing', objData)
    return res;
}

export const sendOtp = async ({ email }) => {
    const objData = { email }
    const res = await instance.post('auth/sent-signing-otp', objData)
    return res;
}

export const loginWithOtp = async ({ email, otp }) => {
    const objData = { email, otp };
    const res = await instance.post('auth/signing-with-otp', objData)
    return res;
}

