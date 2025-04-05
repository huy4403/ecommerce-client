import React, { useState, useEffect, useContext } from "react";
import { FaShoppingBag, FaCog, FaKey, FaMapMarkerAlt, FaBars, FaTimes, FaCamera } from "react-icons/fa";
import ChangePassword from "~/pages/profile/ChangePassword";
import AccountSetting from "~/pages/profile/AccountSetting";
import Address from "~/pages/profile/Address";
import { Link } from "react-router-dom";
import { Context } from "~/ContextProvider";
function Profile() {

    const context = useContext(Context);

    const avatar = context.avatar || localStorage.getItem("avatar") || null;
    const fullname = context.fullName || localStorage.getItem("fullname") || null;

    const [activeSection, setActiveSection] = useState("account_settings");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (activeSection) {

            case "account_settings": return <AccountSetting />
            case "change_password": return <ChangePassword />

            case "address_management": return <Address />

            default:
                return <AccountSetting />;
        }
    };

    return (
        <>
            <title>Quản lý tài khoản</title>
            <div className="min-h-screen bg-gray-100 pt-16 md:pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <aside className={`lg:col-span-3 ${isMobileMenuOpen ? "block fixed inset-0 z-40 bg-white p-4 overflow-y-auto" : "hidden"} 
                    lg:block lg:static lg:p-0 lg:bg-transparent pt-20`}>
                            {isMobileMenuOpen && (
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 lg:hidden pt-20"
                                >
                                    <FaTimes className="h-6 w-6" />
                                </button>
                            )}
                            <div className="sticky top-8 space-y-4 md:space-y-6">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <img
                                            src={avatar}
                                            alt="User Avatar"
                                            className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                        />
                                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1
                                    rounded-full hover:bg-blue-700transition-colors">
                                            <FaCog className="h-3 w-3 md:h-4 md:w-4" />
                                        </button>
                                    </div>
                                    <h2 className="mt-3 md:mt-4 text-lg md:text-xl font-bold text-gray-900">{fullname}</h2>
                                </div>

                                <nav className="space-y-1 md:space-y-2">
                                    <button
                                        onClick={() => {
                                            setActiveSection("account_settings");
                                            if (windowWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors
                                        ${activeSection === "account_settings" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                    >
                                        <FaCog />
                                        <span>Cài đặt tài khoản</span>
                                    </button>
                                    <Link
                                        to="/orders"
                                        onClick={() => {
                                            if (windowWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg
                                        transition-colors text-gray-700 hover:bg-gray-100"
                                    >
                                        <FaShoppingBag />
                                        <span>Đơn mua</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setActiveSection("change_password");
                                            if (windowWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors
                                        ${activeSection === "change_password" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                    >
                                        <FaKey />
                                        <span>Đổi mật khẩu</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveSection("address_management");
                                            if (windowWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors
                                        ${activeSection === "address_management" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                    >
                                        <FaMapMarkerAlt />
                                        <span>Địa chỉ</span>
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden fixed bottom-4 left-4 bg-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg z-50
                        hover:bg-blue-700 transition-colors"
                        >
                            {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
                        </button>

                        <main className="lg:col-span-9 mt-4 md:mt-8 lg:mt-0">
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;