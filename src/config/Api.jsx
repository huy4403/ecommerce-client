import axios from 'axios';
import { authDialog } from '~/components/ui/ConfirmationDialog';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    timeout: 30000,
    headers: {
        // 'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar'
    },
});

instance.interceptors.request.use(request => {
    if (!request.url.includes('auth/signup') &&
        !request.url.includes('auth/signing') &&
        !request.url.includes('auth/signing-with-otp') &&
        !request.url.includes('auth/sent-signing-otp') &&
        !request.url.includes('auth/sent-reset-password-otp') &&
        !request.url.includes('auth/reset-password-with-otp')) {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return request;
}, error => {
    return Promise.reject(error);
});


instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !error.config.url.includes('auth/signup') &&
            !error.config.url.includes('auth/signing') &&
            !error.config.url.includes('auth/signing-with-otp') &&
            !error.config.url.includes('auth/sent-signing-otp') &&
            !error.config.url.includes('auth/sent-reset-password-otp') &&
            !error.config.url.includes('auth/reset-password-with-otp')) {

            let message = "Vui lòng đăng nhập để thực hiện thao tác này!";
            if (error.response.data && error.response.data.error === "Token is expired!") {
                message = "Phiên đăng nhập đã hết hạn!";
            } else if (error.response && error.response.data.error === "You aren't allowed to access this resource") {
                message = "Bạn không có quyền để thực hiện thao tác";
            }

            authDialog(message).then(result => {
                if (result) {
                    window.location.href = "/login";
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('avatar');
                    localStorage.removeItem('fullname');
                    window.location.href = "/";
                }
            });
        }
        return Promise.reject(error);
    }
);

export default instance;