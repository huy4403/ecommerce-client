import { useState, useCallback, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { getAllCategory } from "~/services/category/category-service";
import { getProductById, updateProduct, activeProduct, inactiveProduct, deleteProduct } from "~/services/admin/product-service";
import { useParams, useNavigate } from "react-router";
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import AttributeManagement from "~/pages/admin/ProductManagement/AttributeManagement";
import ProductVariantManagement from "~/pages/admin/ProductManagement/ProductVariantManagement";
import { FaChevronLeft } from "react-icons/fa";

function UpdateProductForm() {

    const { id } = useParams();

    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [status, setStatus] = useState();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllCategory();
                setCategories(response.data.data);
                const res = await getProductById(id);
                setImages(res.data.data.images);
                setStatus(res.data.data.status);

                reset({
                    title: res.data.data.title,
                    categoryId: res.data.data.categoryId,
                    brand: res.data.data.brand || "",
                    importPrice: new Intl.NumberFormat('vi-VN').format(res.data.data.importPrice),
                    price: new Intl.NumberFormat('vi-VN').format(res.data.data.price),
                    description: res.data.data.description
                });
            } catch (err) {
                console.log(err);
                Toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
            }
        })();
    }, [id, reset]);

    const importPrice = watch("importPrice");
    const price = watch("price");

    const formatNumberInput = (value, field) => {
        // Remove any non-digit characters
        const numericValue = value.replace(/\D/g, '');

        // Format with thousand separators
        const formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);

        // Update form value
        setValue(field, formattedValue);

        // Return numeric value for validation
        return numericValue;
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            Toast.error("Chỉ chấp nhận file định dạng JPG, PNG hoặc GIF");
            return;
        }

        if (images.length + newImages.length + acceptedFiles.length > 5) {
            Toast.error("Tối đa 5 hình ảnh");
            return;
        }

        const uploadImages = acceptedFiles.map(file => {
            if (file.size > 5 * 1024 * 1024) {
                Toast.error(`${file.name} exceeds 5MB limit`);
                return null;
            }
            return Object.assign(file, { preview: URL.createObjectURL(file) });
        }).filter(Boolean);

        setNewImages(prev => [...prev, ...uploadImages]);
        setImages(prev => [...prev, ...uploadImages.map(file => file.preview)]);
    }, [images, newImages]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/gif": []
        },
        maxFiles: 5
    });

    const handleUpdateProduct = async (data) => {
        const { title, categoryId, brand, importPrice, price, description } = data;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('categoryId', categoryId);
        formData.append('brand', brand);
        formData.append('importPrice', importPrice.replace(/\D/g, '')); // Remove formatting before sending
        formData.append('price', price.replace(/\D/g, '')); // Remove formatting before sending
        formData.append('description', description);

        // Only append new images to the formData
        newImages.forEach((image) => {
            formData.append('files', image);
        });

        try {
            const res = await updateProduct(id, formData);
            console.log(res);
            Toast.success("Cập nhật sản phẩm thành công");
        } catch (err) {
            console.log(err);
            Toast.error("Đã xảy ra lỗi khi cập nhật sản phẩm");
        } finally {
            setLoading(false);
        }
    }

    const handleActivateProduct = async () => {
        ConfirmationDialog("Bạn có chắc chắn muốn mở kinh doanh sản phẩm này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await activeProduct(id);
                        setStatus("ACTIVE");
                        Toast.success("Mở kinh doanh sản phẩm thành công");
                    } catch (err) {
                        console.log(err);
                        Toast.error("Đã xảy ra lỗi khi mở kinh doanh sản phẩm");
                    }
                }
            });
    }

    const handleDeactivateProduct = async () => {
        ConfirmationDialog("Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm này không?")
            .then(async (result) => {
                if (result) {
                    try {
                        await inactiveProduct(id);
                        setStatus("INACTIVE");
                        Toast.success("Ngừng kinh doanh sản phẩm thành công");
                    } catch (err) {
                        console.log(err);
                        Toast.error("Đã xảy ra lỗi khi ngừng kinh doanh sản phẩm");
                    }
                }
            });
    }

    const removeImg = async (fileToRemove) => {
        try {
            const res = await deleteProduct(id, fileToRemove);
            console.log(res);
            Toast.success("Đã xóa thành công hình ảnh khỏi sản phẩm");
        } catch (err) {
            console.log(err);
            Toast.error(err.response.data.error !== "Json not format"
                ? err.response.data.error
                : "Đã xảy ra lỗi trong quá trình upload hình ảnh");
        }
    }

    const removeImage = (index, file) => {
        // Check if the removed image is a new image
        if (index >= images.length - newImages.length) {
            // It's a new image
            const newImageIndex = index - (images.length - newImages.length);
            setNewImages(prev => prev.filter((_, i) => i !== newImageIndex));
            setImages(prev => prev.filter((_, i) => i !== index));
        } else {
            images.length <= 1
                ? Toast.error("Không thể xóa hình ảnh duy nhất của sản phẩm")
                : ConfirmationDialog("Bạn có thật sự muốn xóa hình ảnh này không?")
                    .then(async (result) => {
                        if (result) {
                            await removeImg(file);
                            setImages(prev => prev.filter((_, i) => i !== index));
                        }
                    });
        }
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            Toast.error("Vui lòng chọn ít nhất 1 hình ảnh");
            return;
        }

        setLoading(true);

        ConfirmationDialog("Bạn có chắc chắn muốn cập nhật sản phẩm này không?")
            .then((result) => {
                if (result) {
                    handleUpdateProduct(data);
                } else {
                    setLoading(false);
                }
            });
    };

    return (
        <>
            <title>Cập nhật sản phẩm</title>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4">
                        <button
                            onClick={() => { navigate("/admin") }}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <FaChevronLeft className="mr-1" /> Quay lại Dashboard
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Cập nhật sản phẩm</h2>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${status === "ACTIVE" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {status === "ACTIVE" ? 'Đang kinh doanh' : 'Đang ngừng kinh doanh'}
                                </span>
                                {status === "ACTIVE" ? (
                                    <button
                                        type="button"
                                        onClick={handleDeactivateProduct}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none
                                        focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Ngừng kinh doanh
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleActivateProduct}
                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none
                                        focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Mở kinh doanh
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                                <input
                                    id="title"
                                    {...register("title", {
                                        required: "Tên sản phẩm không được để trống",
                                        minLength: {
                                            value: 3,
                                            message: "Tên sản phẩm phải có ít nhất 3 ký tự"
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Tên sản phẩm không được vượt quá 100 ký tự"
                                        }
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.title ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Tên sản phẩm"
                                />
                            </div>

                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                                    Thương hiệu <span className="text-red-500">*</span>
                                </label>
                                {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
                                <input
                                    id="brand"
                                    {...register("brand", {
                                        required: "Thương hiệu không được để trống",
                                        maxLength: {
                                            value: 50,
                                            message: "Tên thương hiệu không được vượt quá 50 ký tự"
                                        }
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.brand ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Thương hiệu sản phẩm"
                                />
                            </div>

                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                                    Danh mục <span className="text-red-500">*</span>

                                </label>

                                {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>}
                                <select
                                    id="categoryId"
                                    {...register("categoryId", {
                                        required: "Vui lòng chọn danh mục cho sản phẩm"
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}
                                    focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(category => {
                                        const getLowestLevelCategories = (cat) => {
                                            if (!cat.childrenCategories || cat.childrenCategories.length === 0) {
                                                return [cat];
                                            }
                                            return cat.childrenCategories.flatMap(child => getLowestLevelCategories(child));
                                        };

                                        const lowestCategories = getLowestLevelCategories(category);

                                        return lowestCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ));
                                    })}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="importPrice" className="block text-sm font-medium text-gray-700">
                                    Giá nhập <span className="text-red-500">*</span>
                                </label>
                                {errors.importPrice && <p className="mt-1 text-sm text-red-500">{errors.importPrice.message}</p>}
                                <input
                                    type="text"
                                    id="importPrice"
                                    {...register("importPrice", {
                                        required: "Giá nhập không được để trống",
                                        onChange: (e) => formatNumberInput(e.target.value, "importPrice"),
                                        validate: {
                                            positive: value => parseInt(value.replace(/\D/g, '')) > 0 || "Giá nhập phải lớn hơn 0"
                                        }
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.importPrice ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Giá nhập sản phẩm"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Giá bán <span className="text-red-500">*</span>
                                </label>
                                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                                <input
                                    type="text"
                                    id="price"
                                    {...register("price", {
                                        required: "Giá bán không được để trống",
                                        onChange: (e) => formatNumberInput(e.target.value, "price"),
                                        validate: {
                                            positive: value => parseInt(value.replace(/\D/g, '')) > 0 || "Giá bán phải lớn hơn 0",
                                            greaterThanImport: value =>
                                                parseInt(value.replace(/\D/g, '')) > parseInt(importPrice?.replace(/\D/g, '') || 0) ||
                                                "Giá bán phải lớn hơn giá nhập"
                                        }
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Giá bán sản phẩm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                            <textarea
                                id="description"
                                {...register("description", {
                                    maxLength: {
                                        value: 500,
                                        message: "Mô tả không được vượt quá 500 ký tự"
                                    }
                                })}
                                rows="4"
                                className={`mt-1 block w-full rounded-md shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                placeholder="Mô tả sản phẩm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh mô tả sản phẩm <span className="text-red-500">*</span>
                            </label>
                            {images.length === 0 && (
                                <p className="mt-1 text-sm text-red-500">Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm</p>
                            )}
                            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center
                            hover:border-indigo-500 transition-colors cursor-pointer">
                                <input {...getInputProps()} />
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Kéo thả hình ảnh vào đây, hoặc click để chọn file</p>
                                <p className="text-xs text-gray-400 mt-1">Tối đa 5 hình ảnh (JPG, PNG, GIF) - 5MB mỗi hình</p>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className="h-30 w-full overflow-hidden rounded-lg border border-gray-200">
                                                <img
                                                    src={file}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, file)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                                                hover:bg-red-600 shadow-md transition-all duration-200 transform hover:scale-110"
                                                title="Xóa hình ảnh"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 
                                    ${(loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none focus:ring-2
                                    focus:ring-offset-2focus:ring-indigo-500`}
                            >
                                {loading ? "Đang xử lý..." : "Cập nhật"}
                            </button>
                        </div>
                    </form>

                    <AttributeManagement id={id}
                        attributes={attributes}
                        setAttributes={setAttributes} />
                    <ProductVariantManagement
                        id={id}
                        attributes={attributes}
                    />

                </div>
            </div >
        </>
    );
};

export default UpdateProductForm;