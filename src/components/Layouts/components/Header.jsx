import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiHeart, FiX } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const RecursiveCategory = ({ category, depth = 0 }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <div className={`ml-${depth * 4}`}>
                <div
                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span>{category.name}</span>
                    {category.childrenCategories && category.childrenCategories.length > 0 && (
                        <span className="ml-2">{isExpanded ? "-" : "+"}</span>
                    )}
                </div>
                {isExpanded && category.childrenCategories && category.childrenCategories.length > 0 && (
                    <div className="ml-4">
                        {category.childrenCategories.map((subCategory) => (
                            <RecursiveCategory
                                key={subCategory.id}
                                category={subCategory}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src="https://images.unsplash.com/photo-1614818161758-d8b8ed3be99b"
                                alt="Logo"
                                className="h-10 w-10 object-contain"
                            />
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <FiHeart className="text-2xl cursor-pointer hover:text-red-500" />
                            <FiShoppingCart className="text-2xl cursor-pointer hover:text-blue-500" />
                            <FiUser className="text-2xl cursor-pointer hover:text-green-500" />
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

            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg p-4">
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-4">
                            <FiHeart className="text-2xl" />
                            <span>Wishlist</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <FiShoppingCart className="text-2xl" />
                            <span>Cart</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <FiUser className="text-2xl" />
                            <span>Account</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Header;