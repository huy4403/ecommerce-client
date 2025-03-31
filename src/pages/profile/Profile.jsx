import { useState, useRef } from 'react';
import { FaCamera, FaPlus } from 'react-icons/fa';
import { Toast } from '~/components/ui/Toast';
import { useForm } from 'react-hook-form';

function Profile() {
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        setValue: setProfileValue,
        watch: watchProfile
    } = useForm({
        defaultValues: {
            fullName: "Doan Huy",
            email: "doanhuy0168@gmail.com",
            mobile: "0924021021",
            avatar: "https://res.cloudinary.com/dsiigtqpn/image/upload/v1742371229/194295b9-611e-4175-bb5c-62273d782a94_Liverpool_FC.png"
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch: watchPassword
    } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            rePassword: ""
        }
    });

    const {
        register: registerAddress,
        handleSubmit: handleAddressSubmit,
        formState: { errors: addressErrors },
        reset: resetAddress,
        setValue: setAddressValue,
        watch: watchAddress
    } = useForm({
        defaultValues: {
            fullName: "",
            mobile: "",
            address: "",
            description: ""
        }
    });

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            fullName: "Doan Huy",
            mobile: "0924021021",
            address: "Hà nội",
            description: "Ngõ 90"
        },
        {
            id: 2,
            fullName: "Doan Huy",
            mobile: "0924021021",
            address: "Hà nội",
            description: "Ngõ 90"
        }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const fileInputRef = useRef(null);

    const onProfileSubmit = async (data) => {
        try {
            Toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            Toast.error('Failed to update profile');
        }
    };

    const onPasswordSubmit = async (data) => {
        if (data.newPassword !== data.rePassword) {
            Toast.error('New passwords do not match');
            return;
        }

        try {
            // API call would go here
            Toast.success('Password updated successfully');
            setIsChangingPassword(false);
            resetPassword();
        } catch (error) {
            Toast.error('Failed to update password');
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Toast.error('Please select an image file');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileValue('avatar', reader.result);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            Toast.error('Failed to update avatar');
        }
    };

    const onAddressSubmit = (data) => {
        if (editingAddressId) {
            setAddresses(prev => prev.map(addr =>
                addr.id === editingAddressId ? { ...data, id: editingAddressId } : addr
            ));
            setEditingAddressId(null);
            Toast.success('Address updated successfully');
        } else {
            const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
            setAddresses(prev => [...prev, { ...data, id: newId }]);
            setIsAddingAddress(false);
            Toast.success('Address added successfully');
        }
        resetAddress();
    };

    const handleEditAddress = (id) => {
        const address = addresses.find(a => a.id === id);
        Object.keys(address).forEach(key => {
            if (key !== 'id') {
                setAddressValue(key, address[key]);
            }
        });
        setEditingAddressId(id);
    };

    const handleDeleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        Toast.success('Address deleted successfully');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Cài đặt tài khoản</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <img
                            src={watchProfile('avatar')}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <button
                            onClick={handleAvatarClick}
                            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                        >
                            <FaCamera />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                {...registerProfile('fullName')}
                                disabled={!isEditing}
                                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                {...registerProfile('email')}
                                disabled={true}
                                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                {...registerProfile('mobile')}
                                disabled={!isEditing}
                                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Đổi mật khẩu
                        </button>
                    )}
                </div>

                {isChangingPassword && (
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu cũ
                            </label>
                            <input
                                type="password"
                                {...registerPassword('oldPassword', { required: true })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                {...registerPassword('newPassword', { required: true })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhập lại mật khẩu mới
                            </label>
                            <input
                                type="password"
                                {...registerPassword('rePassword', { required: true })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    resetPassword();
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Địa chỉ</h2>
                    <button
                        onClick={() => setIsAddingAddress(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <FaPlus /> Thêm địa chỉ
                    </button>
                </div>

                {(isAddingAddress || editingAddressId) && (
                    <div className="mb-6 p-4 border rounded-md">
                        <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <input
                                    type="text"
                                    {...registerAddress('fullName', { required: true })}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    {...registerAddress('mobile', { required: true })}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    {...registerAddress('address', { required: true })}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả thêm</label>
                                <input
                                    type="text"
                                    {...registerAddress('description')}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingAddress(false);
                                        setEditingAddressId(null);
                                        resetAddress();
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingAddressId ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {addresses.map(address => (
                        <div key={address.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{address.fullName}</p>
                                    <p className="text-gray-600">{address.mobile}</p>
                                    <p className="text-gray-600">{address.address}</p>
                                    <p className="text-gray-600">{address.description}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditAddress(address.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;
