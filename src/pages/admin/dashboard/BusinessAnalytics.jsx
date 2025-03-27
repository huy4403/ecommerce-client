import { over } from "lodash";
import React, { useState, useEffect } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiTruck, FiX } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getBusinessAnalytics, getPaymentMethodAnalytics } from "~/services/admin/business-analytics-service";
import FormatCurrency from "~/components/utils/FormatCurrency";
function BusinessAnalytics() {

    // begin
    const [dateRange, setDateRange] = useState("daily");
    const [overview, setOverview] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await getBusinessAnalytics(dateRange);
            setOverview(res.data.data);
        })();

        (async () => {
            const res = await getPaymentMethodAnalytics(dateRange);
            setPaymentMethods(res.data.data);
        })();
    }, [dateRange]);

    const revenueData = [
        { name: "Mon", value: 4000 },
        { name: "Tue", value: 3000 },
        { name: "Wed", value: 2000 },
        { name: "Thu", value: 2780 },
        { name: "Fri", value: 1890 },
        { name: "Sat", value: 2390 },
        { name: "Sun", value: 3490 }
    ];

    const orderStatusData = [
        { name: "Pending", value: 400, color: "#FF9F43" },
        { name: "Processing", value: 300, color: "#00CFE8" },
        { name: "Delivered", value: 800, color: "#28C76F" },
        { name: "Canceled", value: 100, color: "#EA5455" }
    ];

    const topProducts = [
        {
            name: "Wireless Earbuds",
            sales: 1200,
            revenue: 28000,
            stock: 45,
            image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434"
        },
        {
            name: "Smart Watch",
            sales: 950,
            revenue: 23750,
            stock: 32,
            image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a"
        },
        {
            name: "Laptop Pro",
            sales: 850,
            revenue: 102000,
            stock: 15,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
        }
    ];

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
    }

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
    //stop


    return (
        <>
            <div className="min-h-screen p-6 bg-gray-50">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title={`Doanh thu ${dateRangeTitle(dateRange)}`} value={FormatCurrency(overview.revenue)} icon={FiDollarSign} />
                        <StatCard title="Tổng đơn hàng" value={overview.totalOrders} icon={FiShoppingBag} />
                        <StatCard title="Đơn hàng đã hoàn thành" value={overview.delivered} icon={FiTruck} />
                        <StatCard title="Đơn hàng bị hủy" value={overview.cancelled} icon={FiX} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Biểu đồ doanh thu</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-white shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Trạng thái đơn hàng</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {orderStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white shadow-lg mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Top sản phẩm</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-4">Sản phẩm</th>
                                        <th className="pb-4">Đã bán</th>
                                        <th className="pb-4">Doanh thu</th>
                                        <th className="pb-4">Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <span className="text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-700">{product.sales}</td>
                                            <td className="py-4 text-gray-700">${product.revenue}</td>
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

                    <div className="p-6 rounded-xl bg-white shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Phương thức thanh toán</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paymentMethods.map((method, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {method.method == "ONLINE" ? "Thanh toán trực tuyến" : "Thanh toán khi nhận hàng"}
                                    </h3>
                                    <p className="text-2xl font-bold mt-2 text-gray-900">
                                        ${method.value.toLocaleString()}
                                    </p>
                                    <p className="text-sm mt-1 text-gray-600">{method.percentage}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default BusinessAnalytics;