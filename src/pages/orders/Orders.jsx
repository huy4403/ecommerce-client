import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserOrders } from '~/services/order/order-service';
import FormatCurrency from '~/components/utils/FormatCurrency';
import { title } from 'framer-motion/client';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await getUserOrders();
                const sortedOrders = response.data.data.sort((a, b) => b.id - a.id);
                setOrders(sortedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        })();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <title>Đơn mua</title>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4 max-w-4xl pb-8 pt-26.5"
            >
                <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                        <Link
                            to="/products"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <Link to={`/order/${order.id}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Đơn hàng #{order.id}</h2>
                                        <span className={`font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {translateStatus(order.orderStatus)}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Ngày đặt:</span>
                                            <span>{order.orderDate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Số lượng sản phẩm:</span>
                                            <span>{order.totalItem}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t">
                                            <span className="font-medium">Tổng tiền:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                {FormatCurrency(order.totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </>
    );
}

export default Orders;