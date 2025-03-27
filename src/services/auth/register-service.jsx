import instance from "~/config/Api";

export const register = async ({ fullName, mobile, email, password, rePassword }) => {
    const objData = { fullName, mobile, email, password, rePassword }
    const res = await instance.post('auth/signup', objData)
    return res;
}