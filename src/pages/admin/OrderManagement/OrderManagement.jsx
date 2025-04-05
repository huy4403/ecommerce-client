import { getAllOrders, updateOrderStatus, updateTransactionStatus } from "~/services/admin/order-service";
import { useEffect, useState } from "react";
import { Toast } from "~/components/ui/toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import FormatCurrency from "~/components/utils/FormatCurrency";
import { Link } from "react-router-dom";

function OrderManagement() {

    localStorage.setItem("activeSection", "orders");

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getAllOrders();
            // Sort orders by id in descending order
            const sortedOrders = response.data.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        })();
    }, []);

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PLACED': return 'bg-blue-100 text-blue-800';
            case 'CONFIRMED': return 'bg-indigo-100 text-indigo-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTransactionStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'SUCCESS': return 'bg-green-100 text-green-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const translatePaymentMethod = (method) => {
        switch (method) {
            case 'ONLINE': return 'Thanh toán online';
            case 'DIRECT': return 'Thanh toán trực tiếp';
            default: return method;
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        ConfirmationDialog("Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await updateOrderStatus(orderId, newStatus);
                        setOrders(orders.map(order =>
                            order.id === orderId ? { ...order, orderStatus: newStatus } : order
                        ));
                        Toast.success("Cập nhật trạng thái đơn hàng thành công");
                    } catch (error) {
                        Toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
                    }
                }
            })
    };

    const handleTransactionStatusChange = async (orderId, newStatus) => {
        ConfirmationDialog("Bạn có chắc chắn muốn cập nhật trạng thái thanh toán đơn hàng này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await updateTransactionStatus(orderId, newStatus);
                        setOrders(orders.map(order =>
                            order.id === orderId ? { ...order, status: newStatus } : order
                        ));
                        Toast.success("Cập nhật trạng thái thanh toán thành công");
                    } catch (error) {
                        Toast.error("Lỗi khi cập nhật trạng thái thanh toán");
                    }
                }
            })
    };

    const orderStatusOptions = [
        { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'PLACED', label: 'Đã đặt', color: 'bg-blue-100 text-blue-800' },
        { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-indigo-100 text-indigo-800' },
        { value: 'SHIPPED', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    ];

    const transactionStatusOptions = [
        { value: 'PENDING', label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'SUCCESS', label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
        { value: 'FAILED', label: 'Thất bại', color: 'bg-red-100 text-red-800' }
    ];

    return (
        <>
            <title>Quản lý đơn hàng</title>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="font-bold">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Ngày mua
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Phương thức thanh toán
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Trạng thái thanh toán
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Trạng thái đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{FormatCurrency(order.total)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.orderDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{translatePaymentMethod(order.paymentMethod)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className={`px-2 py-1 text-xs font-semibold rounded border ${getTransactionStatusColor(order.status)}`}
                                            value={order.status}
                                            onChange={(e) => handleTransactionStatusChange(order.id, e.target.value)}
                                        >
                                            {transactionStatusOptions.map(option => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                    className={option.color}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className={`px-2 py-1 text-xs font-semibold rounded border ${getOrderStatusColor(order.orderStatus)}`}
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {orderStatusOptions.map(option => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                    className={option.color}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="px-4 py-2 text-xs font-semibold rounded bg-blue-500 text-white hover:bg-blue-600">
                                            <Link to={`/admin/order/${order.id}`}>Xem chi tiết</Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default OrderManagement;
