import { loginWithPassword } from '~/services/auth/login-service'
import { useForm } from "react-hook-form"
import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Toast } from "~/components/ui/Toast";
import { Context } from "~/ContextProvider";

const Login = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(Context);

    useEffect(() => {
        localStorage.clear();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true)
        const { email, password } = data;
        await loginWithPassword({ email, password })
            .then(res => {
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('avatar', res.data.data.avatar)
                localStorage.setItem('fullname', res.data.data.fullName)

                if (res.data.data.role === "ADMIN") {
                    navigate('/admin')
                    context.setIsLogin(true);
                } else if (res.data.data.role === "USER") {
                    navigate('/')
                    context.setIsLogin(true);
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response.data.error == "Bad Credentials!") {
                    Toast.error('Tài khoản hoặc mật khẩu không chính xác!')
                } else {
                    if (err.response.data.error == "Your account is banned!") {
                        Toast.error('Tài khoản của bạn đã bị vô hiệu hóa!')
                    }
                }
            })
            .finally(() => {
                setIsLoading(false)
            });
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 border border-gray-300 
            shadow-smrounded-lg bg-white max-w-[700px] mx-auto mt-20">
                <Link to='/'><IoMdArrowRoundBack size={20} /></Link>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Đăng nhập
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="flex text-sm/6 font-medium text-gray-900">
                                <IoMailOutline size={20} />&nbsp;Email
                            </label>
                            {errors.email && <span className='text-red-500 text-sm'>Vui lòng nhập email đăng nhập</span>}
                            <div className="mt-2">
                                <input
                                    id="email"
                                    {...register("email", { required: true })}
                                    placeholder='Email đăng nhập'
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                                    outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="flex text-sm/6 font-medium text-gray-900">
                                    <RiLockPasswordLine size={20} />&nbsp;Mật khẩu
                                </label>

                            </div>
                            {errors.password && <span className='text-red-500 text-sm'>Vui lòng nhập mật khẩu</span>}
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder='Mật khẩu'
                                    {...register("password", { required: true })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                                    outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div className="text-sm float-end">
                            <Link to='/forgot' className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6
                                font-semibold text-white shadow-xs focus-visible:outline-2
                                focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer
                                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Bạn chưa có tài khoản?{' '}
                        <Link to={'/register'} className="font-semibold text-indigo-600 hover:text-indigo-500 underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login;
