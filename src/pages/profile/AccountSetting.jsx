import { useState, useContext, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { uploadAvatar, updateProfile, getProfile } from "~/services/profile/profile-service";
import { Toast } from "~/components/ui/Toast";
import { Context } from "~/ContextProvider";
import { useForm } from "react-hook-form";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
function AccountSetting() {
    const context = useContext(Context);
    const avatar = context.avatar || localStorage.getItem('avatar') || null;
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [profile, setProfile] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        (async () => {
            const res = await getProfile();
            setProfile(res.data.data);
            reset({
                fullName: res.data.data.fullName,
                email: res.data.data.email,
                mobile: res.data.data.mobile
            });
        })();
    }, [reset]);

    const onSubmit = async (data) => {
        ConfirmationDialog("Bạn có thực sự muốn thay đổi thông tin tài khoản của mình không?")
            .then(async (result) => {
                if (result) {
                    setIsUpdating(true);
                    try {
                        const { fullName, mobile } = data;
                        const res = await updateProfile({ fullName, mobile });
                        setProfile(res.data.data);
                        context.setFullName(fullName);
                        localStorage.setItem('fullname', fullName);
                        Toast.success("Cập nhật thông tin tài khoản thành công");
                    } catch (err) {
                        Toast.error("Có lỗi xảy ra khi cập nhật thông tin tài khoản");
                    } finally {
                        setIsUpdating(false);
                    }
                }
            })
    };

    const handleUploadAvatar = async (e) => {
        const file = e.target.files[0];
        try {
            setIsUploading(true);
            const res = await uploadAvatar(file);
            localStorage.setItem('avatar', res.data.data);
            context.setAvatar(res.data.data);
            Toast.success('Cập nhật ảnh đại diện thành công');
        } catch (error) {

            console.log(error);
            if (error.response.error === "Maximum upload size exceeded") {
                Toast.error('Kích thước ảnh đại diện vượt quá 50MB');
            } else if (error.response.data.error === "validation error") {
                Toast.error('Định dạng tệp không hợp lệ. Vui lòng tải lên tệp JPEG, PNG, SVG, GIF hoặc WEBP.');
            }
        } finally {
            setIsUploading(false);
        }
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Cài đặt tài khoản</h2>
            <div className="flex justify-center mb-6 md:mb-8">
                <div className="relative">
                    <div className={`relative ${isUploading ? 'opacity-50' : ''}`}>
                        <img
                            src={avatar}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full spin-animation"></div>
                            </div>
                        )}
                    </div>
                    <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 md:p-2
                    rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <FaCamera className="h-4 w-4 md:h-5 md:w-5" />
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadAvatar}
                        disabled={isUploading}
                    />
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
                    <div className="space-y-3 md:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                            )}
                            <input
                                type="text"
                                placeholder="Nhập họ tên"
                                {...register("fullName", {
                                    required: "Vui lòng nhập họ tên",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ỹ\s]+$/,
                                        message: "Họ tên chỉ được chứa chữ cái và dấu tiếng Việt"
                                    }
                                })}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500
                                focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="mt-1 text-sm text-gray-500">Email không thể thay đổi</p>
                            <input
                                type="email"
                                disabled
                                value={profile.email}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            {errors.mobile && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
                            )}
                            <input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                {...register("mobile", {
                                    required: "Vui lòng nhập số điện thoại",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Số điện thoại phải có 10 chữ số"
                                    }
                                })}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500
                                focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isUpdating}
                    className={`w-full bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors
                    font-medium shadow-sm hover:shadow-md ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
            </form>
        </div>
    );
}

export default AccountSetting;
