import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaTag, FaBox, FaEdit, FaPlusCircle, FaStopCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import debounce from "lodash/debounce";
import { productManagementService, inactiveProduct, activeProduct } from "~/services/admin/product-service";
import { getAllCategoryAdmin } from "~/services/category/category-service";
import { Toast } from "~/components/ui/Toast";
import { Link } from "react-router-dom";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import FormatCurrency from "~/components/utils/formatCurrency";

const ProductManagement = () => {

    localStorage.setItem("activeSection", "products");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [request, setRequest] = useState({
        page: 1,
        limit: 20
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await productManagementService(request);
                setProducts(res.data.data.products);
                setTotalPages(res.data.data.total_page);

                if (firstLoad) {
                    // Fetch categories from API
                    const categoryRes = await getAllCategoryAdmin();
                    const categoriesFromApi = categoryRes.data.data;
                    setCategories([{ id: 0, name: "Tất cả" }, ...categoriesFromApi]);
                    setFirstLoad(false);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        })();

    }, [firstLoad, request, refresh]);

    const [priceRange, setPriceRange] = useState([0, 100000000]);

    const handlePriceRange = (newPriceRange) => {
        setPriceRange(newPriceRange);
        setRequest(prev => ({
            ...prev,
            minPrice: newPriceRange[0],
            maxPrice: newPriceRange[1]
        }));
    };

    const handleSelectCategory = (category) => {
        setRequest(prev => ({
            ...prev,
            category: category === "Tất cả" ? null : category
        }));
    };

    const handleSearch = useMemo(
        () => debounce((term) => {
            setRequest(prev => ({
                ...prev,
                title: term
            }));
        }, 300),
        []
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setRequest(prev => ({
                ...prev,
                page: newPage
            }));
        }
    };

    const openDialog = (id, action) => {

        ConfirmationDialog(`Bạn có chắc chắn muốn ${action === 'ACTIVE' ? 'mở' : 'ngừng'} kinh doanh sản phẩm này không?`)
            .then((result) => {
                if (result) {
                    if (action === 'ACTIVE') {
                        handleActiveProduct(id);
                    } else {
                        handleInactiveProduct(id);
                    }
                }
            });
    };

    const handleActiveProduct = async (id) => {
        try {
            await activeProduct(id);
            Toast.success("Đã mở kinh doanh sản phẩm id: " + id);
            setRefresh(!refresh);
        } catch (error) {
            console.log(error);
            Toast.error("Đã xảy ra lỗi khi mở kinh doanh sản phẩm id: " + id);
        }
    }

    const handleInactiveProduct = async (id) => {
        try {
            await inactiveProduct(id);
            Toast.success("Đã ngừng kinh doanh sản phẩm id: " + id);
            setRefresh(!refresh);
        } catch (error) {
            console.log(error);
            Toast.error("Đã xảy ra lỗi khi ngừng kinh doanh sản phẩm id: " + id);
        }
    }

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition- cursor-pointer"
                    >
                        <Link to={`/admin/product/${product.id}`}>
                            <FaEdit />
                        </Link>
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="mb-2">
                    <span className="text-sm text-gray-500">ID: {product.id}</span>
                    <h3 className="font-bold text-lg line-clamp-2" title={product.title}>{product.title}</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-600">
                        <FaTag className="mr-1" />
                        {product.category}
                    </span>
                    <span className="text-lg font-semibold text-primary-600">
                        {FormatCurrency(product.price)}
                    </span>
                </div>
                <div
                    className={`flex items-center ${product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 10
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                >
                    <FaBox className="mr-1" />
                    {product.stock === 0
                        ? "Hết hàng"
                        : `Số lượng tồn kho: (${product.stock})`
                    }
                </div>
                <p>Thương hiệu: {product.brand}</p>
                <p>{product.variant} biến thể</p>
                <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        {product.status === "ACTIVE"
                            ? "Đang kinh doanh"
                            : "Đã ngừng kinh doanh"}
                    </span>
                    <button
                        onClick={() => openDialog(product.id, product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium transition-colors duration-200 ${product.status === "ACTIVE"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {product.status === "ACTIVE" ? "Ngừng kinh doanh" : "Mở kinh doanh"}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <title>Quản lý sản phẩm</title>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg
                            hover:bg-green-600 transition-colors cursor-pointer"
                        >
                            <Link to="/admin/product" className="flex items-center gap-2">
                                <FaPlusCircle />
                                Thêm sản phẩm
                            </Link>
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Từ khóa tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            onChange={(e) => handleSelectCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex-1 px-4">
                            <p className="mb-2 text-gray-700">Khoảng giá:</p>
                            <Slider
                                range
                                min={0}
                                max={100000000}
                                defaultValue={[0, 100000000]}
                                value={priceRange}
                                onChange={handlePriceRange}
                                // className="mb-4"
                                // trackStyle={[{ backgroundColor: '#E5E7EB' }]}
                                // handleStyle={[
                                //     { backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' },
                                //     { backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' }
                                // ]}
                                railStyle={{ backgroundColor: '#E5E7EB' }}
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>{FormatCurrency(priceRange[0])}</span>
                                <span>{FormatCurrency(priceRange[1])}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="flex justify-center items-center mt-8 gap-4">
                            <button
                                onClick={() => handlePageChange(request.page - 1)}
                                disabled={request.page === 1}
                                className={`p-2 rounded-full ${request.page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                                text-white`}
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="text-gray-600">
                                Trang {request.page} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(request.page + 1)}
                                disabled={request.page === totalPages}
                                className={`p-2 rounded-full ${request.page === totalPages
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'}
                                    text-white`}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProductManagement;