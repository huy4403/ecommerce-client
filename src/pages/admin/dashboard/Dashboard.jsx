import React, { useState, useEffect } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiGrid } from "react-icons/fi";
import { getDashboard } from "~/services/admin/dashboard-service";
import BusinessAnalytics from "./BusinessAnalytics";

function DashBoard({ setActiveSection }) {

    localStorage.setItem("activeSection", "dashboard");

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {
        (async () => {
            const res = await getDashboard();
            setDashboard(res.data);
        })();
    }, []);

    const handleClick = (section) => {
        setActiveSection(section);
    }

    const MetricCard = ({ title, value, icon, section }) => (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg
        hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick(section)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{value}</p>
                </div>
                <div className="text-3xl text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">{icon}</div>
            </div>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Khách hàng" value={dashboard.customer} icon={<FiUsers />} section="users" />
                <MetricCard title="Sản phẩm" value={dashboard.product} icon={<FiBox />} section="products" />
                <MetricCard title="Danh mục" value={dashboard.category} icon={<FiGrid />} section="categories" />
                <MetricCard title="Đơn hàng" value={dashboard.order} icon={<FiShoppingBag />} section="orders" />
            </div>
            <BusinessAnalytics />
        </>
    );
};

export default DashBoard;