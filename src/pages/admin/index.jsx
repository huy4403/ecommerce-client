import React, { useState } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiPieChart, FiGrid, FiMenu, FiX } from "react-icons/fi";
import UserManagement from "~/pages/admin/UserManagement/UserManagement";
import CategoryManagement from "~/pages/admin/CategoryManagement/CategoryManagement";
import ProductManagement from "~/pages/admin/ProductManagement/ProductManagement";
import Dashboard from "~/pages/admin/dashboard/Dashboard";
import OrderManagement from "~/pages/admin/OrderManagement/OrderManagement";
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Index() {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState(localStorage.getItem('activeSection') || "dashboard");

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const navigate = useNavigate();

    const navigationItems = [
        { id: "dashboard", label: "Tổng quan", icon: <FiPieChart /> },
        { id: "users", label: "Quản lý khách hàng", icon: <FiUsers /> },
        { id: "categories", label: "Quản lý danh mục", icon: <FiGrid /> },
        { id: "products", label: "Quản lý sản phẩm", icon: <FiBox /> },
        { id: "orders", label: "Quản lý đơn hàng", icon: <FiShoppingBag /> },
    ];
    return (
        <>
            <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white dark:bg-gray-800 min-h-screen shadow-lg`}>
                    <div className="p-4 flex justify-between items-center">
                        <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
                        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            {sidebarOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                    <nav className="mt-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 
                                ${activeSection === item.id ? 'bg-blue-50 dark:bg-gray-700' : ''} cursor-pointer`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <nav>
                        <button
                            className="w-full flex items-center p-4 hover:bg-red-100 dark:hover:bg-gray-700
                        border-t-2 border-back text-xl text-red-500"
                            onClick={() => navigate('/login')}
                        >
                            <span><MdOutlineLogout /></span>
                            <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>Đăng xuất</span>
                        </button>
                    </nav>
                </div>

                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-semibold">{navigationItems.find(item => item.id === activeSection)?.label}</h1>
                    </div>

                    {activeSection === "dashboard" && <Dashboard setActiveSection={setActiveSection} />}
                    {activeSection === "users" && <UserManagement />}
                    {activeSection === "categories" && <CategoryManagement />}
                    {activeSection === "products" && <ProductManagement />}
                    {activeSection === "orders" && <OrderManagement />}
                </div>
            </div>
        </>
    );
};

export default Index;