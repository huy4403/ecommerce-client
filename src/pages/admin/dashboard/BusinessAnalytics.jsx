import { over } from "lodash";
import React, { useState, useEffect } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiTruck, FiX } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getBusinessAnalytics, getPaymentMethodAnalytics, getOrderStatusAnalytics, getProductAnalytics, getRevenueAnalytics } from "~/services/admin/business-analytics-service";
import FormatCurrency from "~/components/utils/FormatCurrency";

function BusinessAnalytics() {

    const [dateRange, setDateRange] = useState("daily");
    const [overview, setOverview] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [products, setProducts] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'sales', direction: 'desc' });

    useEffect(() => {
        (async () => {
            const res = await getBusinessAnalytics(dateRange);
            setOverview(res.data.data);
        })();

        (async () => {
            const res = await getPaymentMethodAnalytics(dateRange);
            setPaymentMethods(res.data.data);
        })();

        (async () => {
            const res = await getOrderStatusAnalytics(dateRange);
            const transformedData = res.data.data
                .filter(item => item.value > 0)
                .map(item => ({
                    ...item,
                    ...transformOrderStatusData(item.status)
                }));
            setOrderStatus(transformedData);
        })();

        (async () => {
            const res = await getProductAnalytics(dateRange);
            const sortedProducts = res.data.data.sort((a, b) => b.sales - a.sales);
            setProducts(sortedProducts);
        })();

        (async () => {
            const res = await getRevenueAnalytics(dateRange);
            setRevenueData(res.data.data);
        })();

    }, [dateRange]);

    const transformOrderStatusData = (data) => {
        switch (data) {
            case "PENDING":
                return {
                    name: "Chờ xác nhận",
                    color: "#FF9F43"
                };
            case "PLACED":
                return {
                    name: "Đã đặt hàng",
                    color: "#00CFE8"
                };
            case "CONFIRMED":
                return {
                    name: "Đã xác nhận",
                    color: "#7367F0"
                };
            case "SHIPPED":
                return {
                    name: "Đang giao hàng",
                    color: "#9C27B0"
                };
            case "DELIVERED":
                return {
                    name: "Đã giao hàng",
                    color: "#28C76F"
                };
            case "CANCELLED":
                return {
                    name: "Đã hủy",
                    color: "#EA5455"
                };
            default:
                return {
                    name: data,
                    color: "#999999"
                };
        }
    };

    const dateRangeTitle = (dateRange) => {
        switch (dateRange) {
            case "daily":
                return "hôm nay";
            case "weekly":
                return "tuần này";
            case "monthly":
                return "tháng này";
            case "yearly":
                return "năm nay";
        }
    };

    const StatCard = ({ title, value, icon: Icon }) => (
        <div className="p-6 rounded-xl bg-white shadow-lg cursor-pointer">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                    <Icon className="w-6 h-6 text-gray-600" />
                </div>
            </div>
        </div>
    );

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });

        const sortedProducts = [...products].sort((a, b) => {
            if (direction === 'desc') {
                return b[key] - a[key];
            }
            return a[key] - b[key];
        });
        setProducts(sortedProducts);
    };

    return (
        <>
            <div className="min-h-screen p-6 bg-gray-50 mt-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Phân tích kinh doanh</h1>
                        <div className="flex items-center gap-4">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="p-2 rounded-lg bg-white text-gray-900 shadow-md"
                            >
                                <option value="daily">Hôm nay</option>
                                <option value="weekly">Tuần này</option>
                                <option value="monthly">Tháng này</option>
                                <option value="yearly">Năm nay</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <StatCard title={`Doanh thu ${dateRangeTitle(dateRange)}`} value={FormatCurrency(overview.revenue)} icon={FiDollarSign} />
                        <StatCard title={`Lợi nhuận ${dateRangeTitle(dateRange)}`} value={FormatCurrency(overview.profit)} icon={FiDollarSign} />
                        <StatCard title="Tổng đơn hàng" value={overview.totalOrders} icon={FiShoppingBag} />
                        <StatCard title="Đơn hàng đã hoàn thành" value={overview.delivered} icon={FiTruck} />
                        <StatCard title="Đơn hàng bị hủy" value={overview.cancelled} icon={FiX} />
                    </div>

                    <div className="p-6 rounded-xl bg-white shadow-lg mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Biểu đồ doanh thu {dateRangeTitle(dateRange)}</h2>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%" className="cursor-pointer">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 50, bottom: 30 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#4B5563"
                                        label={{
                                            value: dateRange === 'daily' ? 'Giờ' :
                                                dateRange === 'weekly' ? 'Thứ' :
                                                    dateRange === 'monthly' ? 'Ngày' : 'Tháng',
                                            position: 'bottom',
                                            offset: 20,
                                            style: { fontSize: '14px', fill: '#4B5563' }
                                        }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => FormatCurrency(value)}
                                        stroke="#4B5563"
                                        label={{
                                            value: 'VNĐ',
                                            angle: -90,
                                            position: 'insideLeft',
                                            offset: -35,
                                            style: { fontSize: '14px', fill: '#4B5563', textAnchor: 'middle' }
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${FormatCurrency(value)}`, 'Doanh thu']}
                                        labelFormatter={(label) => {
                                            if (dateRange === 'daily') {
                                                return `${label} giờ`;
                                            } else if (dateRange === 'weekly') {
                                                return `Thứ ${label}`;
                                            } else if (dateRange === 'monthly') {
                                                return `Ngày ${label}`;
                                            } else {
                                                return `Tháng ${label}`;
                                            }
                                        }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#6366F1"
                                        fill="url(#colorRevenue)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 cursor-pointer">
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h2 className="text-xl font-bold mb-6 text-gray-900">Phương thức thanh toán</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paymentMethods.map((method, index) => (
                                    <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            {method.method === "ONLINE" ? "Thanh toán trực tuyến" : "Thanh toán khi nhận hàng"}
                                        </h3>
                                        <div className="flex items-end gap-2">
                                            <p className="text-3xl font-bold text-indigo-600">
                                                {FormatCurrency(method.value)}
                                            </p>
                                            <span className="text-sm font-medium text-indigo-500 mb-1">
                                                ({method.percentage}%)
                                            </span>
                                        </div>
                                        <div className="mt-4 w-full bg-indigo-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: `${method.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-white shadow-lg cursor-pointer">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Trạng thái đơn hàng</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderStatus}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value, percentage }) => `${name}: ${value} (${percentage}%)`}
                                        >
                                            {orderStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                                        <Legend formatter={(value, entry) => `${value} (${entry.payload.percentage}%)`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white shadow-lg mb-8 cursor-pointer">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Top sản phẩm</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-4">Sản phẩm</th>
                                        <th
                                            className="pb-4 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('sales')}
                                        >
                                            Đã bán {sortConfig.key === 'sales' ? (sortConfig.direction === 'desc' ? '↓' : '↑') : ''}
                                        </th>
                                        <th
                                            className="pb-4 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('revenue')}
                                        >
                                            Doanh thu {sortConfig.key === 'revenue' ? (sortConfig.direction === 'desc' ? '↓' : '↑') : ''}
                                        </th>
                                        <th
                                            className="pb-4 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('profit')}
                                        >
                                            Lợi nhuận {sortConfig.key === 'profit' ? (sortConfig.direction === 'desc' ? '↓' : '↑') : ''}
                                        </th>
                                        <th className="pb-4">Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <span className="text-gray-900">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-700">{product.sales}</td>
                                            <td className="py-4 text-gray-700">{FormatCurrency(product.revenue)}</td>
                                            <td className="py-4 text-gray-700">{FormatCurrency(product.profit)}</td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${product.stock > 30
                                                        ? "bg-green-100 text-green-800"
                                                        : product.stock > 20
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BusinessAnalytics;