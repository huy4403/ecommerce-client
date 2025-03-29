import { useState, useCallback, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { getAllCategory } from "~/services/category/category-service";
import { createProduct } from "~/services/admin/product-service";
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

function ProductForm() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        mode: 'onChange'
    });
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllCategory();
                setCategories(response.data.data);
            } catch (err) {
                console.log(err);
                Toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
            }
        })();
    }, []);

    const importPrice = watch("importPrice");

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            Toast.error("Chỉ chấp nhận file định dạng JPG, PNG hoặc GIF");
            return;
        }

        if (images.length + acceptedFiles.length > 5) {
            Toast.error("Tối đa 5 hình ảnh");
            return;
        }

        const newImages = acceptedFiles.map(file => {
            if (file.size > 5 * 1024 * 1024) {
                Toast.error(`${file.name} exceeds 5MB limit`);
                return null;
            }
            return Object.assign(file, { preview: URL.createObjectURL(file) });
        }).filter(Boolean);

        setImages(prev => [...prev, ...newImages]);
    }, [images]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/gif": []
        },
        maxFiles: 5
    });
    const handleCreateProduct = async (data) => {
        const { title, categoryId, importPrice, price, description, brand } = data;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('categoryId', categoryId);
        formData.append('importPrice', importPrice);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('brand', brand);

        images.forEach((image) => {
            formData.append('files', image);
        });

        try {
            const res = await createProduct(formData);
            Toast.success("Tạo sản phẩm thành công");
            setValue("title", "");
            setValue("categoryId", "");
            setValue("importPrice", "");
            setValue("price", "");
            setValue("description", "");
            setValue("brand", "");
            setImages([]);
            navigate(`/admin/product/${res.data.data.id}`);
        } catch (err) {
            console.log(err);
            Toast.error("Đã xảy ra lỗi khi tạo sản phẩm");
        } finally {
            setLoading(false);
        }
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            Toast.error("Vui lòng chọn ít nhất 1 hình ảnh");
            return;
        }

        setLoading(true);

        ConfirmationDialog("Bạn có chắc chắn muốn tạo sản phẩm này không?")
            .then((result) => {
                if (result) {
                    handleCreateProduct(data);
                } else {
                    setLoading(false);
                }
            });
    };

    return (
        <>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thêm sản phẩm</h2>

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
                                            message: "Thương hiệu không được vượt quá 50 ký tự"
                                        }
                                    })}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.brand ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Thương hiệu"
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
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="importPrice" className="block text-sm font-medium text-gray-700">
                                    Giá nhập <span className="text-red-500">*</span>
                                </label>
                                {errors.importPrice && <p className="mt-1 text-sm text-red-500">{errors.importPrice.message}</p>}
                                <input
                                    type="number"
                                    id="importPrice"
                                    {...register("importPrice", {
                                        required: "Giá nhập không được để trống",
                                        min: {
                                            value: 0,
                                            message: "Giá nhập phải lớn hơn 0"
                                        }
                                    })}
                                    step="0.01"
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
                                    type="number"
                                    id="price"
                                    {...register("price", {
                                        required: "Giá bán không được để trống",
                                        min: {
                                            value: 0,
                                            message: "Giá bán phải lớn hơn 0"
                                        },
                                        validate: value =>
                                            Number(value) > Number(importPrice) ||
                                            "Giá bán phải lớn hơn giá nhập"
                                    })}
                                    step="0.01"
                                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-indigo-500 focus:border-indigo-500 px-2 py-2`}
                                    placeholder="Giá bản sản phẩm"
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
                                            <div className="h-32 w-full overflow-hidden rounded-lg border border-gray-200">
                                                <img
                                                    src={file.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-all"
                                                title="Xóa hình ảnh"
                                            >
                                                <FiX size={16} />
                                            </button>
                                            <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none
                                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 
                                    ${(loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none focus:ring-2
                                    focus:ring-offset-2focus:ring-indigo-500`}
                            >
                                {loading ? "Đang xử lý..." : "Tạo mới"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductForm;