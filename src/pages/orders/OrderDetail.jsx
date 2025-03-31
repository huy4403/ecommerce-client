import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormatCurrency from '~/components/utils/FormatCurrency';
import { getOrderById } from '~/services/order/order-service';

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await getOrderById(id);
                setOrder(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return <Navigate to="/NotFound" replace />;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-500';
            case 'PLACED': return 'text-orange-500';
            case 'CONFIRMED': return 'text-blue-500';
            case 'SHIPPED': return 'text-indigo-500';
            case 'DELIVERED': return 'text-green-500';
            case 'CANCELLED': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'PLACED': return 'Đã đặt hàng';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'SHIPPED': return 'Đang giao hàng';
            case 'DELIVERED': return 'Đã giao hàng';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const translatePaymentStatus = (status) => {
        switch (status) {
            case 'SUCCESS': return 'Thành công';
            case 'PENDING': return 'Chờ thanh toán';
            case 'FAILED': return 'Thất bại';
            default: return status;
        }
    };

    const translatePaymentMethod = (method) => {
        switch (method) {
            case 'COD': return 'Thanh toán khi nhận hàng';
            case 'ONLINE': return 'Thanh toán trực tuyến';
            default: return method;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 max-w-4xl pb-8 pt-26.5"
        >
            <Link
                to="/orders"
                className="inline-block mb-4 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Quay lại danh sách đơn hàng
                </span>
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Đơn hàng #{order.id}</h1>
                    <span className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {translateStatus(order.orderStatus)}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="font-semibold mb-2">Thông tin giao hàng</h2>
                        <div className="text-gray-600">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.mobile}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.description}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">Thông tin đơn hàng</h2>
                        <div className="text-gray-600">
                            <p>Ngày đặt: {order.orderDate}</p>
                            <p>Phương thức thanh toán: {translatePaymentMethod(order.paymentMethod)}</p>
                            <p>Ngày giao hàng dự kiến: {order.deliveryDate}</p>
                            <p>Trạng thái thanh toán: {translatePaymentStatus(order.transactionStatus)}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h2 className="font-semibold mb-4">Chi tiết sản phẩm</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <motion.div
                                key={item.productId}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center p-4 border rounded-lg"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.brand}</p>
                                    <div className="text-sm text-gray-500">
                                        {item.attribute.map((attr, index) => (
                                            <span key={attr.id}>
                                                {attr.value}
                                                {index < item.attribute.length - 1 && ' - '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{FormatCurrency(item.price)}</p>
                                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-t mt-6 pt-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Tổng tiền ({order.totalItem} sản phẩm):</span>
                        <span className="text-xl font-bold text-blue-600">
                            {FormatCurrency(order.totalPrice)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OrderDetail;