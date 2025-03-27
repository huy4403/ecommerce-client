import Swal from "sweetalert2";

const ConfirmationDialog = (text) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: "Xác nhận",
            text: text,
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            reverseButtons: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "Hủy"
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    });
};

export const authDialog = (text) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: text,
            showCancelButton: true,
            confirmButtonText: "Đăng nhập",
            reverseButtons: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "Từ chối"
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    });
};

export default ConfirmationDialog;
