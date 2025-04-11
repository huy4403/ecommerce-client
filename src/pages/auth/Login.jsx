import { loginWithPassword, sendOtp, loginWithOtp } from '~/services/auth/login-service'
import { useForm } from "react-hook-form"
import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Toast } from "~/components/ui/Toast";
import { Context } from "~/ContextProvider";
import Logo from "~/assets/img/react.svg";

const Login = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [typeLogin, setTypeLogin] = useState('password');
    const context = useContext(Context);
    const [countdown, setCountdown] = useState(0);
    const [loadingSendOtp, setLoadingSendOtp] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const handleSetTypeLogin = () => {
        setTypeLogin(prev => prev === 'password' ? 'otp' : 'password');
    }

    const handleSendOtp = async () => {
        const email = watch("email");
        if (!email) {
            Toast.error("Vui lòng nhập email");
            return;
        }

        try {
            setLoadingSendOtp(true);
            await sendOtp({ email });

            setCountdown(60);
            Toast.success("Đã gửi mã OTP thành công");
        } catch (err) {
            console.log(err);
            Toast.error("Email không tồn tại!");
        } finally {
            setLoadingSendOtp(false);
        }
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        const { email, password, otp } = data;
        try {
            let res;
            if (typeLogin === 'password') {
                res = await loginWithPassword({ email, password });
            } else {
                res = await loginWithOtp({ email, otp });
            }

            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('avatar', res.data.data.avatar)
            localStorage.setItem('fullname', res.data.data.fullName)
            localStorage.setItem('role', res.data.data.role)

            if (res.data.data.role === "ADMIN") {
                navigate('/admin')
                context.setIsLogin(true);
            } else if (res.data.data.role === "USER") {
                navigate('/')
                context.setIsLogin(true);
            }
        } catch (err) {
            console.log(err);
            if (err.response.data.error === "Bad Credentials!") {
                Toast.error('Tài khoản hoặc mật khẩu không chính xác!');
            } else if (err.response.data.error === 'OTP is incorrect or does not exist') {
                Toast.error('Mã OTP không chính xác!');
            } else if (err.response.data.error === "Your account is banned!") {
                Toast.error('Tài khoản của bạn đã bị vô hiệu hóa!')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <title>Đăng nhập</title>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url('https://img.lovepik.com/photo/40008/0007.jpg_wh860.jpg')`,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backgroundBlendMode: 'overlay'
                }}
            >
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 border border-gray-300 
                shadow-lg rounded-lg bg-white/95 backdrop-blur-sm max-w-[700px] mx-auto">
                    <Link to='/' className="text-gray-700 hover:text-gray-900 transition-colors">
                        <IoMdArrowRoundBack size={20} />
                    </Link>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
                            <img src={Logo} alt="logo" className='h-10 w-10 object-contain spin-animation' />
                            <span className='text-red-400'>Đoàn Huy Ecommerce</span>
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
                                {typeLogin === 'otp' && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={countdown > 0 || isLoading}
                                        className={`text-sm mt-2 font-semibold float-end
                                            ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500'}`}
                                    >
                                        {loadingSendOtp ? 'Đang gửi...' : (countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi OTP')}
                                    </button>
                                )}
                            </div>

                            {typeLogin === 'password'
                                ? (
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
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="otp" className="flex text-sm/6 font-medium text-gray-900">
                                                Mã xác thực OTP
                                            </label>

                                        </div>
                                        {errors.otp && <span className='text-red-500 text-sm'>Vui lòng nhập OTP</span>}
                                        <div className="mt-2">
                                            <input
                                                id="otp"
                                                type="text"
                                                placeholder='Mã OTP'
                                                {...register("otp", { required: true })}
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                                        outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2
                                        focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                )
                            }

                            <div className="flex justify-between">
                                <div className="text-sm justify-start">
                                    <button className="font-semibold text-indigo-600 hover:text-indigo-500"
                                        type='button'
                                        onClick={handleSetTypeLogin}
                                    >
                                        {typeLogin === 'password' ? 'Đăng nhập với OTP' : 'Đăng nhập với mật khẩu'}
                                    </button>
                                </div>
                                <div className="text-sm justify-end">
                                    <Link to='/forgot' className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
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
            </div>
        </>
    )
}

export default Login;
