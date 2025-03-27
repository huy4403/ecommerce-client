import axios from 'axios';
import { authDialog } from '~/components/ui/ConfirmationDialog';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    timeout: 8000,
    headers: {
        // 'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar'
    },
});

instance.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
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