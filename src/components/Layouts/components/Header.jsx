import React, { useState, useEffect, useContext, useRef } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiHeart, FiX, FiLogOut, FiPackage, FiSettings, FiChevronDown } from "react-icons/fi";
import Logo from "~/assets/img/react.svg";
import defaultAvatar from "~/assets/img/default_avatar.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "~/ContextProvider";
import { getCartCount } from "~/services/cart/cart-service";
import { getAllCategory } from "~/services/category/category-service";
import { Toast } from "~/components/ui/Toast";

function Header() {

    const navigate = useNavigate();
    const thisPath = useLocation();

    const context = useContext(Context);

    const fullname = context.fullName || localStorage.getItem("fullname") || null;
    const avatar = context.avatar || localStorage.getItem("avatar") || null;
    const token = localStorage.getItem("token") || null;
    const role = localStorage.getItem("role") || null;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const categoryModalRef = useRef(null);
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [visible, setVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }

            if (categoryModalRef.current && !categoryModalRef.current.contains(event.target)) {
                setIsCategoryModalOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
            setIsUserMenuOpen(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    useEffect(() => {
        if (token) {
            (async () => {
                const res = await getCartCount();
                context.setCartCount(res.data.data);
            })()
        }
    }, [context.isLogin])

    useEffect(() => {

        (async () => {
            const res = await getAllCategory();
            setCategories([
                {
                    id: 0,
                    name: 'Tất cả',
                    childrenCategories: []
                },
                ...res.data.data
            ]);
        })()
    }, [])

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        if (thisPath.pathname === '/products') {
            context.setKeyword(keyword);
        } else {
            navigate('/products');
            context.setKeyword(keyword);
        }
    }
    useEffect(() => {
        if (context.isLogin === true) {
            Toast.success("Chào mừng bạn đến với hệ thống thương mại điện tử của Đoàn Huy");
            context.setIsLogin(null);
        } else if (context.isLogin === false) {
            Toast.success("Đã đăng xuất");
            context.setIsLogin(null);
        }
    }, [context.isLogin]);

    const handleLogOut = () => {
        localStorage.clear();
        context.setIsLogin(false);
        navigate('/');
    }

    const UserMenu = () => (
        <div ref={userMenuRef} className="absolute -right-18 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-center">
            <div className="px-4 py-2 border-b text-center">
                <p className="font-semibold text-center">{fullname}</p>
            </div>
            {role === "ADMIN" && (
                <Link to="/admin" className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 text-center"
                    onClick={() => setIsUserMenuOpen(false)}
                >
                    Admin Dashboard
                </Link>
            )}
            <Link to="/profile" className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 text-center"
                onClick={() => setIsUserMenuOpen(false)}
            >
                <FiSettings className="mr-2" size={20} />
                Tài khoản
            </Link>
            <Link to="/orders" className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 text-center"
                onClick={() => setIsUserMenuOpen(false)}
            >
                <FiPackage className="mr-2" size={20} />
                Đơn hàng
            </Link>
            <div className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 text-red-500 text-center cursor-pointer"
                onClick={handleLogOut}
            >
                <FiLogOut className="mr-2" size={20} />
                Đăng xuất
            </div>
        </div>
    );

    const CategoryMenu = () => (
        <div className="relative">
            <button
                className="text-pink-500 font-medium uppercase flex items-center text-sm md:text-lg"
                onClick={() => setIsCategoryModalOpen(true)}
            >
                Danh mục
                <FiChevronDown className="ml-1" />
            </button>
        </div>
    );

    const CategoryModal = () => (
        <>
            <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setIsCategoryModalOpen(false)}></div>
            <div
                ref={categoryModalRef}
                className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-pink-500">Danh mục</h2>
                    <button onClick={() => setIsCategoryModalOpen(false)}>
                        <FiX className="text-2xl" />
                    </button>
                </div>
                <div className="p-4">
                    {categories.map((category) => (
                        <div key={category.id} className="mb-2">
                            <Link
                                to={category.childrenCategories && category.childrenCategories.length > 0
                                    ? "#"
                                    : `/products`}
                                className={`flex items-center justify-between px-4 py-2 font-semibold hover:bg-pink-50 rounded-md w-full
                                    ${thisPath.pathname === '/products' && context.categorySelected === category.name
                                        ? "bg-pink-200 text-pink-700 font-semibold"
                                        : "text-gray-700"
                                    }`}
                                onClick={(e) => {
                                    if (category.childrenCategories && category.childrenCategories.length > 0) {
                                        e.preventDefault();
                                    } else {
                                        setIsCategoryModalOpen(false);
                                        context.setCategorySelected(category.name);
                                    }
                                }}
                            >
                                {category.name}
                                {category.childrenCategories && category.childrenCategories.length > 0 && (
                                    <FiChevronDown className="ml-2" />
                                )}
                            </Link>
                            {category.childrenCategories && category.childrenCategories.length > 0 && (
                                <div className="ml-4 mt-1">
                                    {category.childrenCategories.map((subCategory) => (
                                        <Link
                                            key={subCategory.id}
                                            to={`/products`}
                                            className={`flex items-center px-4 py-2 hover:bg-pink-50 rounded-md w-full
                                                ${thisPath.pathname === '/products' && context.categorySelected === subCategory.name
                                                    ? "bg-pink-200 text-pink-700 font-semibold"
                                                    : "text-gray-600"
                                                }`}
                                            onClick={() => {
                                                setIsCategoryModalOpen(false);
                                                context.setCategorySelected(subCategory.name);
                                            }}
                                        >
                                            {subCategory.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <>
            <header className={`bg-pink-100 shadow-md fixed w-full z-50 transition-transform duration-300
                ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="h-10 w-10 object-contain spin-animation"
                                />
                            </Link>
                            <CategoryMenu />
                            <Link to="/about" className="text-pink-500 font-medium md:text-lg text-sm uppercase">Về chúng tôi</Link>
                        </div>
                        <div className="hidden lg:block flex-1 mx-10">
                            <marquee
                                behavior="scroll"
                                direction="left"
                                scrollamount="15"
                                className="text-pink-600 font-medium text-lg uppercase"
                            >
                                ✨ Xin chào mừng quý khách đến với hệ thống thương mại điện tử của Đoàn Huy ✨
                            </marquee>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Từ khóa tìm kiếm..."
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={searchKeyword}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            {token ? (
                                <>
                                    <div className="relative">
                                        <Link to="/cart">
                                            <FiShoppingCart className="text-2xl cursor-pointer hover:text-blue-500" />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center
                                            justify-center text-xs">
                                                {context.cartCount}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src={avatar ?? defaultAvatar}
                                            alt="User avatar"
                                            className="w-8 h-8 rounded-full cursor-pointer"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        />
                                        {isUserMenuOpen && <UserMenu />}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu mobile */}
            {isMenuOpen && (
                <div ref={mobileMenuRef} className={`md:hidden bg-white shadow-lg p-4 flex justify-center text-center border-2 
                border-pink-300 w-full fixed z-40 transition-transform duration-300 ${visible ? 'translate-y-18' : '-translate-y-full'}`}>
                    <div className="flex flex-col items-center space-y-4 w-full">
                        <input
                            type="text"
                            placeholder="Từ khóa tìm kiếm..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            value={searchKeyword}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {token ? (
                            <>
                                <div className="flex items-center justify-center w-full">
                                    <div className="flex items-center space-x-4 justify-center w-full">
                                        <img
                                            src={avatar ?? defaultAvatar}
                                            alt="User avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-center">{fullname}</span>
                                    </div>
                                </div>

                                <Link to="/profile" className="flex items-center justify-center space-x-4 w-full py-2 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiSettings className="text-2xl" />
                                    <span>Tài khoản</span>
                                </Link>


                                <Link to="/cart" className="flex items-center justify-center space-x-4 w-full py-2 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="relative">
                                        <FiShoppingCart className="text-2xl" />
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center
                                        justify-center text-xs">
                                            {context.cartCount}
                                        </span>
                                    </div>
                                    <span>Giỏ hàng</span>
                                </Link>

                                <Link to="/orders" className="flex items-center justify-center space-x-4 w-full py-2 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiPackage className="text-2xl" />
                                    <span>Đơn hàng</span>
                                </Link>

                                <div className="flex items-center justify-center space-x-4 text-red-500 w-full py-2 
                                hover:bg-gray-100 cursor-pointer" onClick={() => {
                                        handleLogOut();
                                        setIsMenuOpen(false);
                                    }}>
                                    <FiLogOut className="text-2xl" />
                                    <span>Đăng xuất</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-4 w-full">
                                <Link to="/login" className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="w-full px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50">
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div >
            )
            }

            {/* Category Modal */}
            {isCategoryModalOpen && <CategoryModal />}
        </>
    );
};

export default Header;