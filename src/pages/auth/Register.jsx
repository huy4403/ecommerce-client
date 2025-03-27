import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { register as registerService } from "~/services/auth/register-service";
import { Toast, ToastContainer } from "~/components/ui/Toast";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true);

        const { fullName, mobile, email, password, rePassword } = data;

        if (password != rePassword) {
            Toast.error("Mật khẩu xác nhận không khớp!");
            setIsLoading(false);
            return
        }
        await registerService({ fullName, mobile, email, password, rePassword })
            .then(res => {

                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('avatar', res.data.data.avatar)
                localStorage.setItem('fullname', res.data.data.fullName)

                Toast.success("Đăng ký tài khoản thành công!");

                navigate('/');
            })
            .catch(err => {
                console.log(err.response.data.details);
                Toast.error(err.response.data.details);
                setIsLoading(false);
            })
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 border border-gray-300 
        shadow-sm rounded-lg bg-white max-w-[700px] mx-auto mt-5">
                <Link to='/'><IoMdArrowRoundBack size={20} /></Link>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Đăng ký tài khoản
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="flex text-sm/6 font-medium text-gray-900">
                                <FaUser className="mr-2 mt-0.5" />
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            {errors.fullName?.type === 'required' && <span className="text-red-500">Vui lòng nhập họ tên</span>}
                            {errors.fullName?.type === 'pattern' && <span className="text-red-500">Họ tên chỉ được chứa chữ cái tiếng Việt</span>}
                            <div className="mt-2">
                                <input
                                    id="fullName"
                                    placeholder="Họ và tên"
                                    {...register("fullName", {
                                        required: true,
                                        pattern: /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/
                                    })}
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mobile" className="flex text-sm/6 font-medium text-gray-900">
                                <FaPhone className="mr-2 mt-0.5" />
                                Số điện thoại
                            </label>
                            {errors.mobile?.type === 'pattern' && <span className="text-red-500">Số điện thoại phải có 10 chữ số</span>}
                            <div className="mt-2">
                                <input
                                    id="mobile"
                                    placeholder="Số điện thoại"
                                    {...register("mobile", {
                                        required: false,
                                        pattern: /^[0-9]{10}$/
                                    })}
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="flex text-sm/6 font-medium text-gray-900">
                                <IoMailOutline className="mr-2 mt-0.5" />
                                Email <span className="text-red-500">*</span>
                            </label>
                            {errors.email?.type === 'required' && <span className="text-red-500">Vui lòng nhập email</span>}
                            {errors.email?.type === 'pattern' && <span className="text-red-500">Email không hợp lệ</span>}
                            <div className="mt-2">
                                <input
                                    id="email"
                                    placeholder="Email"
                                    {...register("email", {
                                        required: true,
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                    })}
                                    type="email"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />

                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="flex text-sm/6 font-medium text-gray-900">
                                <RiLockPasswordLine className="mr-2 mt-0.5" />
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            {errors.password?.type === 'required' && <span className="text-red-500">Vui lòng nhập mật khẩu</span>}
                            {errors.password?.type === 'minLength' && <span className="text-red-500">Mật khẩu phải có ít nhất 6 ký tự</span>}
                            <div className="mt-2">
                                <input
                                    id="password"
                                    placeholder="Mật khẩu"
                                    {...register("password", { required: true, minLength: 6 })}
                                    type="password"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="rePassword" className="flex text-sm/6 font-medium text-gray-900">
                                <RiLockPasswordLine className="mr-2 mt-0.5" />
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            {errors.rePassword && <span className="text-red-500">Vui lòng xác nhận mật khẩu</span>}
                            <div className="mt-2">
                                <input
                                    id="rePassword"
                                    placeholder="Xác nhận mật khẩu"
                                    {...register("rePassword", { required: true })}
                                    type="password"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm 
                            font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                            focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : "Đăng ký"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Register