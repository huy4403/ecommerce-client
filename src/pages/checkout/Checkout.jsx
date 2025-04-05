import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import FormatCurrency from '~/components/utils/FormatCurrency';
import { updateCartItemQuantity } from '~/services/cart/cart-service';
import { Toast } from '~/components/ui/Toast';
import { getAllAddress, createAddress } from '~/services/address/address-service';
import { createOrder } from '~/services/order/order-service';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isCheckout = location.state?.isCheckout;
    const isCheckoutSession = sessionStorage.getItem('isCheckout');
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            mobile: '',
            address: '',
            description: ''
        }
    });

    const [items, setItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState();
    const [showAddressList, setShowAddressList] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
        setItems(storedItems);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllAddress();
                setAddresses(response.data.data);
            } catch (error) {
                Toast.error("Vui lòng thêm địa chỉ nhận hàng");
            }
        })();
    }, []);

    if (!isCheckout || !isCheckoutSession) {
        return <Navigate to="/NotFound" replace />
    }

    const handleQuantityChange = async (id, quantity) => {
        const prevCartItems = [...items];
        const itemToUpdate = items.find(item => item.id === id);

        if (!itemToUpdate) return;

        const newQuantity = itemToUpdate.quantityBuy + quantity;

        if (newQuantity < 1 || newQuantity > itemToUpdate.stock) {
            Toast.error("Hàng tồn kho không đủ");
            return;
        }

        const updatedCartItems = items.map(item =>
            item.id === id ? { ...item, quantityBuy: newQuantity } : item
        );

        setItems(updatedCartItems);

        try {
            await updateCartItemQuantity(id, quantity);
            localStorage.setItem('items', JSON.stringify(updatedCartItems));
        } catch (error) {
            setItems(prevCartItems);
            Toast.error("Không thể cập nhật số lượng sản phẩm");
        }
    };

    const handleCreateOrder = async () => {

        setIsLoading(true);

        const order = {
            addressId: selectedAddress.id,
            paymentMethod: paymentMethod,
            cartItemIds: items.map(item => item.id)
        }

        try {
            const response = await createOrder(order);
            localStorage.removeItem('items');
            if (response.data.data.paymentUrl) {
                setIsLoading(false);
                window.location.href = response.data.data.paymentUrl;
                sessionStorage.removeItem('isCheckout');
            } else {
                const id = response.data.data.orderId;
                navigate(`/order/result/${id}`, { state: { isCheckout: true } });
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            Toast.error("Không thể tạo đơn hàng");
        }
    }

    const handleDeleteItem = async (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        localStorage.setItem('items', JSON.stringify(updatedItems));
    };

    const onSubmit = async (data) => {
        try {
            const response = await createAddress(data);
            setShowAddressForm(false);
            setAddresses([...addresses, { id: response.data.data, ...data }]);
            reset();
            Toast.success("Thêm địa chỉ thành công");
        } catch (error) {
            Toast.error("Không thể thêm địa chỉ");
        }
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantityBuy), 0);

    return (
        <>
            <title>Đặt hàng</title>
            <div className="container mx-auto px-4 pb-8 pt-26.5 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center border-b pb-4">
                                        <img
                                            src={item.productImageUrl}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <div className="text-sm text-gray-600">
                                                {item.attributeValues.map((attr, index) => (
                                                    <span key={attr.id}>
                                                        {attr.value}
                                                        {index < item.attributeValues.length - 1 ? ' - ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-blue-600 font-bold">{FormatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                                disabled={item.quantityBuy <= 1}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="w-8 text-center">{item.quantityBuy}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                                disabled={item.quantityBuy >= item.stock}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">

                            <div className="bg-white rounded-lg mb-6">
                                <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>
                                <div className="space-y-2">
                                    {addresses.length === 0 ? ' Không có địa chỉ nhận hàng'
                                        : !selectedAddress && (
                                            <button
                                                onClick={() => setShowAddressList(true)}
                                                className="w-full py-3 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                                            >
                                                + Chọn địa chỉ nhận hàng
                                            </button>
                                        )}
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="w-full py-3 px-4 border border-green-500 text-green-500 rounded-lg hover:bg-green-50"
                                    >
                                        + Thêm địa chỉ mới
                                    </button>
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Họ tên *</label>
                                            <input
                                                {...register("fullName", { required: "Họ tên là bắt buộc" })}
                                                className="w-full p-2 border rounded"
                                                placeholder="Nhập họ tên"
                                            />
                                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                                            <input
                                                {...register("mobile", {
                                                    required: "Số điện thoại là bắt buộc",
                                                    pattern: {
                                                        value: /^[0-9]{10}$/,
                                                        message: "Số điện thoại không hợp lệ"
                                                    }
                                                })}
                                                className="w-full p-2 border rounded"
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
                                            <input
                                                {...register("address", { required: "Địa chỉ là bắt buộc" })}
                                                className="w-full p-2 border rounded"
                                                placeholder="Nhập địa chỉ"
                                            />
                                            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Ghi chú</label>
                                            <input
                                                {...register("description")}
                                                className="w-full p-2 border rounded"
                                                placeholder="Nhập ghi chú (không bắt buộc)"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                            >
                                                Thêm địa chỉ
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddressForm(false);
                                                    reset();
                                                }}
                                                className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {showAddressList && (
                                    <div className="space-y-4 mt-4">
                                        {addresses.map(address => (
                                            <div
                                                key={address.id}
                                                className={`p-4 border rounded-lg cursor-pointer 
                                                ${selectedAddress?.id === address.id ? 'border-blue-500' : 'border-gray-200'}`}
                                                onClick={() => {
                                                    setSelectedAddress(address);
                                                    setShowAddressList(false);
                                                }}
                                            >
                                                <p className="font-medium">{address.fullName}</p>
                                                <p className="text-gray-600">{address.mobile}</p>
                                                <p className="text-gray-600">{address.address}</p>
                                                <p className="text-gray-600">{address.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedAddress && !showAddressList && !showAddressForm && (
                                    <div className="border rounded-lg p-4 mt-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">{selectedAddress.fullName}</p>
                                                <p className="text-gray-600">{selectedAddress.mobile}</p>
                                                <p className="text-gray-600">{selectedAddress.address}</p>
                                                <p className="text-gray-600">{selectedAddress.description}</p>
                                            </div>
                                            <button
                                                onClick={() => setShowAddressList(true)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Thay đổi
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Chọn phương thức thanh toán</option>
                                    <option value="ONLINE">Thanh toán online</option>
                                    <option value="COD">Thanh toán khi nhận hàng</option>
                                </select>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền hàng:</span>
                                    <span>{FormatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span>{FormatCurrency(30000)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-4">
                                    <span>Tổng thanh toán:</span>
                                    <span className="text-red-600">{FormatCurrency(total + 30000)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-medium
                                     hover:bg-blue-700 transition-colors disabled:opacity-50"
                                disabled={!selectedAddress || !paymentMethod || !items.length || isLoading}
                                onClick={handleCreateOrder}
                            >
                                {isLoading ? 'Đang thanh toán' : 'Thanh toán'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
