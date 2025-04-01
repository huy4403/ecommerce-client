import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getAllAddress, deleteAddress, createAddress, updateAddress } from "~/services/address/address-service";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import { Toast } from "~/components/ui/Toast";
function Address() {
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            fullName: "",
            mobile: "",
            address: "",
            description: ""
        }
    });

    useEffect(() => {
        (async () => {
            const res = await getAllAddress();
            setAddresses(res.data.data);
        })();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingAddressId) {
                const dt = { fullName: data.fullName, mobile: data.mobile, address: data.address, description: data.description };
                await updateAddress(editingAddressId, dt);
                setAddresses(prev => prev.map(addr =>
                    addr.id === editingAddressId ? { ...data, id: editingAddressId } : addr
                ));
                setEditingAddressId(null);
                Toast.success("Cập nhật địa chỉ thành công");
            } else {
                console.log(data);
                const response = await createAddress(data);
                setAddresses(prev => [...prev, { ...data, id: response.data.id }]);
                setShowAddForm(false);
                Toast.success("Thêm địa chỉ thành công");
            }
            reset();
        } catch (error) {
            console.log(error);
            Toast.error("Có lỗi xảy ra");
        }
    };

    const handleDeleteAddress = async (id) => {
        const result = await ConfirmationDialog("Bạn có thực sự muốn xóa địa chỉ này không?");
        if (result) {
            try {
                await deleteAddress(id);
                setAddresses(prev => prev.filter(a => a.id !== id));
                Toast.success("Đã xóa địa chỉ thành công");
            } catch (error) {
                Toast.error("Có lỗi xảy ra khi xóa địa chỉ");
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quản lý địa chỉ</h2>
            <button
                onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingAddressId(null);
                    reset();
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
                {showAddForm ? "Hủy" : "Thêm địa chỉ mới"}
            </button>

            {showAddForm && (
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-4">
                    <h3 className="font-semibold mb-3 md:mb-4">Thêm địa chỉ mới</h3>
                    <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                {...register("fullName", { required: true })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                {...register("mobile", { required: true })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                {...register("address", { required: true })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                            <input
                                {...register("description")}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập ghi chú (nếu có)"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Lưu địa chỉ
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-3 md:space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        {editingAddressId === address.id ? (
                            <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <input
                                        {...register("fullName")}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Họ và tên"
                                    />
                                </div>
                                <div>
                                    <input
                                        {...register("mobile")}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                                <div>
                                    <input
                                        {...register("address")}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Địa chỉ"
                                    />
                                </div>
                                <div>
                                    <input
                                        {...register("description")}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ghi chú thêm"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >Lưu
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingAddressId(null);
                                            reset();
                                        }}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                    <h3 className="font-semibold">{address.fullName}</h3>
                                    <p className="text-gray-600">{address.mobile}</p>
                                    <p className="text-gray-600">{address.address}</p>
                                    {address.description && (
                                        <p className="text-gray-500 text-sm">{address.description}</p>
                                    )}
                                </div>
                                <div className="mt-3 sm:mt-0 space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingAddressId(address.id);
                                            Object.keys(address).forEach(key => {
                                                setValue(key, address[key]);
                                            });
                                        }}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Address;
