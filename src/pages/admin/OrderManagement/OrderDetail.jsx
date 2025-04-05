import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById, updateOrderStatus, updateTransactionStatus } from "~/services/admin/order-service";
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import FormatCurrency from "~/components/utils/FormatCurrency";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaPrint } from "react-icons/fa";

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrderById(id);
                setOrder(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                Toast.error("Không thể tải thông tin đơn hàng");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

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
            case 'COD': return 'Thanh toán trực tiếp';
            default: return method;
        }
    };

    const handleStatusChange = async (newStatus) => {
        ConfirmationDialog("Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await updateOrderStatus(id, newStatus);
                        setOrder({ ...order, orderStatus: newStatus });
                        Toast.success("Cập nhật trạng thái đơn hàng thành công");
                    } catch (error) {
                        console.log(error);
                        Toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
                    }
                }
            });
    };

    const handleTransactionStatusChange = async (newStatus) => {
        ConfirmationDialog("Bạn có chắc chắn muốn cập nhật trạng thái thanh toán đơn hàng này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await updateTransactionStatus(id, newStatus);
                        setOrder({ ...order, transactionStatus: newStatus });
                        Toast.success("Cập nhật trạng thái thanh toán thành công");
                    } catch (error) {
                        console.log(error);
                        Toast.error("Lỗi khi cập nhật trạng thái thanh toán");
                    }
                }
            });
    };

    const handlePrint = () => {
        window.print();
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
            <title>Chi tiết đơn hàng</title>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link to="/admin" className="mr-4">
                            <IoMdArrowRoundBack size={24} className="text-gray-600 hover:text-gray-900" />
                        </Link>
                        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{id}</h1>
                    </div>
                    {!loading && order && (
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <FaPrint />
                            In đơn hàng
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="spinner"></div>
                        <p className="mt-2">Đang tải thông tin đơn hàng...</p>
                    </div>
                ) : !order ? (
                    <div className="text-center py-10">
                        <p>Không tìm thấy thông tin đơn hàng</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {/* Thông tin đơn hàng */}
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p><span className="font-medium">Ngày đặt:</span> {order.orderDate}</p>
                                    <p className="mt-2"><span className="font-medium">Ngày giao dự kiến:</span> {order.deliveryDate}</p>
                                    <p className="mt-2"><span className="font-medium">Phương thức thanh toán:</span> {translatePaymentMethod(order.paymentMethod)}</p>
                                    <p><span className="font-medium">Tổng tiền:</span>&nbsp;{FormatCurrency(order.totalPrice)}</p>
                                    <p className="mt-2"><span className="font-medium">Tình trạng thanh toán:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTransactionStatusColor(order.transactionStatus)}`}>
                                            {transactionStatusOptions.find(option => option.value === order.transactionStatus)?.label || order.transactionStatus}
                                        </span>
                                    </p>
                                    <p className="mt-2"><span className="font-medium">Tình trạng đơn hàng:
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                                            {orderStatusOptions.find(option => option.value === order.orderStatus)?.label || order.orderStatus}
                                        </span>
                                    </span>
                                    </p>
                                </div>
                                <div>
                                    <p><span className="font-medium">Khách hàng:</span> {order.customer || 'N/A'}</p>
                                    <p className="mt-2"><span className="font-medium">Số điện thoại:</span> {order.shippingAddress?.mobile || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ giao hàng */}
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
                            <p>{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.mobile}</p>
                            <p>{order.shippingAddress?.address}</p>
                            {order.shippingAddress?.description && <p>Ghi chú: {order.shippingAddress.description}</p>}
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 font-bold">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Sản phẩm</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Thuộc tính</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Đơn giá</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-md object-cover" src={item.image || '/placeholder.png'}
                                                                alt={item.title} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                            <div className="text-sm text-gray-500">{item.brand}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.attribute?.map((attr, i) => (
                                                        <div key={i}>{attr.name}: {attr.value}</div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {FormatCurrency(item.price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                                    {FormatCurrency(item.price * item.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50">
                                            <td colSpan="4" className="px-6 py-4 text-right font-bold">Tổng cộng:</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">
                                                {FormatCurrency(order.totalPrice)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Cập nhật trạng thái đơn hàng</h2>
                                <div className="flex flex-wrap gap-2">
                                    {orderStatusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleStatusChange(option.value)}
                                            disabled={order.orderStatus === option.value}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${order.orderStatus === option.value
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : `${option.color} hover:opacity-80`
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Cập nhật trạng thái thanh toán</h2>
                                <div className="flex flex-wrap gap-2">
                                    {transactionStatusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleTransactionStatusChange(option.value)}
                                            disabled={order.transactionStatus === option.value}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${order.transactionStatus === option.value
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : `${option.color} hover:opacity-80`
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default OrderDetail;
