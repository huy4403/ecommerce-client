import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '~/services/profile/profile-service';
import { Toast } from '~/components/ui/Toast';
function ChangePassword() {

    const { register,
        handleSubmit,
        watch,
        formState: { errors } } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await changePassword(data);
            Toast.success('Đổi mật khẩu thành công');
        } catch (error) {
            if (error.response.data.error === "Current password does not match") {
                Toast.error('Mật khẩu hiện tại không chính xác');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        {...register("currentPassword", { required: "Vui lòng nhập mật khẩu hiện tại" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        {...register("newPassword", {
                            required: "Vui lòng nhập mật khẩu mới",
                            minLength: { value: 6, message: "Mật khẩu phải từ 6 ký tự trở lên" }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu mới",
                            validate: value => value === watch("newPassword") || "Mật khẩu không khớp"
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
