import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { sendForgotPasswordOTP, verifyForgotPasswordOTP } from "~/services/auth/forgot-service";
import { Toast } from "~/components/ui/Toast";
import { ErrorBar } from "recharts";

function Forgot() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmitEmail = async (data) => {
        try {
            setIsLoading(true);
            await sendForgotPasswordOTP({ email: data.email });
            setEmail(data.email);
            setStep(2);
            Toast.success("Mã OTP đã được gửi đến email của bạn");
        } catch (error) {
            if (error.response.data.error === "User not found with email") {
                Toast.error("Email không tồn tại");
            } else if (error.response.data.error === "Your account has been banned.") {
                Toast.error("Tài khoản của bạn đã bị khóa");
            } else {
                Toast.error("Có lỗi xảy ra khi gửi mã OTP");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitReset = async (data) => {
        try {
            setIsLoading(true);
            await verifyForgotPasswordOTP({
                email: email,
                otp: data.otp,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            Toast.success("Đặt lại mật khẩu thành công");
            navigate("/login");
        } catch (error) {
            if (error.response.data.error === "OTP is incorrect or does not exist") {
                Toast.error("Mã OTP không hợp lệ");
            } else {
                Toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Quên mật khẩu</h2>
                </div>

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitEmail)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                                Quay lại đăng nhập
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : 'Gửi mã xác nhận'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitReset)}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Mã OTP
                            </label>
                            {errors.otp && (
                                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                            )}
                            <input
                                id="otp"
                                type="text"
                                {...register("otp", {
                                    required: "Vui lòng nhập mã OTP",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Mã OTP phải có 6 chữ số"
                                    }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                                focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                            )}
                            <input
                                id="newPassword"
                                type="password"
                                {...register("newPassword", {
                                    required: "Vui lòng nhập mật khẩu mới",
                                    minLength: {
                                        value: 4,
                                        message: "Mật khẩu phải có ít nhất 4 ký tự"
                                    }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Vui lòng xác nhận mật khẩu",
                                    validate: value => value === watch("newPassword") || "Mật khẩu không khớp"
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                                focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-600 hover:text-blue-500"
                                disabled={isLoading}
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none
                                    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : 'Đặt lại mật khẩu'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Forgot;
