import React, { useState, useEffect, useContext } from "react";
import { Context } from "~/ContextProvider";
import { FetchProducts } from "~/services/product/product-service";
import { Toast } from "~/components/ui/toast";
import { Link } from "react-router-dom";
import FormatCurrency from "~/components/utils/FormatCurrency";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { MdExpandMore } from "react-icons/md";

function Products() {

    const categorySelected = useContext(Context).categorySelected;
    const keyword = useContext(Context).keyword;

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handlePriceRange = (newPriceRange) => {
        setPriceRange(newPriceRange);
        setProducts([]);
        setCurrentPage(1);
    };

    const request = {
        title: keyword || '',
        categoryName: categorySelected === "Tất cả" ? null : categorySelected,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page: currentPage,
        limit: 9,
    }

    const fetchProductsData = async (req) => {
        setIsLoading(true);
        try {
            const response = await FetchProducts(req);
            const newProducts = response.data.data.products;

            if (req.page === 1) {
                setProducts(newProducts);
            } else {
                setProducts(prevProducts => [...prevProducts, ...newProducts]);
            }

            setHasMoreProducts(newProducts.length === req.limit);
        } catch (err) {
            Toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setCurrentPage(1);
        setHasMoreProducts(true);

        const initialRequest = {
            ...request,
            page: 1
        };

        fetchProductsData(initialRequest);
    }, [categorySelected, keyword]);

    useEffect(() => {
        fetchProductsData(request);
    }, [currentPage, priceRange]);

    const loadMoreProducts = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (

        <>
            <div className="flex-1 px-2 sm:px-4 pt-20 sm:pt-28.5 mx-2 sm:mx-4 md:mx-8 lg:mx-100">
                <p className="mb-2 text-gray-700 font-bold text-sm sm:text-base">Khoảng giá:</p>
                <Slider
                    range
                    min={0}
                    max={100000000}
                    defaultValue={[0, 100000000]}
                    value={priceRange}
                    onChange={handlePriceRange}
                    railStyle={{ backgroundColor: '#E5E7EB' }}
                    className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                    <span>{FormatCurrency(priceRange[0])}</span>
                    <span>{FormatCurrency(priceRange[1])}</span>
                </div>
            </div>
            <div className="md:col-span-3 mt-10 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <div key={`${product.id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg
                                transition-shadow duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                                        <p className="text-gray-600 mt-1">{product.brand}</p>
                                        <p className="text-gray-600 mt-1">Tồn kho: {product.stock}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-xl font-bold text-blue-600">{FormatCurrency(product.price)}</span>
                                            <Link to={`/product/${product.id}`}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasMoreProducts && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    className="px-6 py-3 bg-white text-blue-700 rounded-md hover:text-red-600 transition-colors duration-300
                                    disabled:opacity-50 flex"
                                    onClick={loadMoreProducts}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'} <MdExpandMore size={25} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <h3 className="text-gray-600 h-[18vh] flex justify-center items-center font-bold text-2xl"
                        >
                            {isLoading ? 'Đang tải sản phẩm...' : 'Không tìm thấy sản phẩm phù hợp với tiêu chí'}
                        </h3>
                    </div>
                )}
            </div>
        </>
    );
};

export default Products;
