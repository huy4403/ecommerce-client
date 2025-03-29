import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from '~/components/ui/Toast';
import ConfirmationDialog from '~/components/ui/ConfirmationDialog';
import { getCategoryById, getAllCategoryAdmin } from '~/services/category/category-service';
import { createCategory, updateCategory } from '~/services/admin/category-service';
import { FaChevronLeft } from 'react-icons/fa';

const FormCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllCategoryAdmin(id);
                setAllCategories(response.data.data);

                if (id) {
                    const resp = await getCategoryById(id);
                    setValue('name', resp.data.data.name);
                    setValue('parentId', resp.data.data.parentId || '');
                }
            } catch (error) {
                Toast.error('Không thể tải danh sách danh mục');
                console.error(error);
            }
        })();

        (async () => {
            if (isEditMode) {
                try {
                    setIsLoading(true);
                    const response = await getCategoryById(id);
                    const categoryData = response.data.data;
                    setValue('name', categoryData.name);
                    setValue('parentId', categoryData.parentId || '');
                    setIsLoading(false);
                } catch (error) {
                    Toast.error('Không thể tải thông tin danh mục');
                    console.error(error);
                    setIsLoading(false);
                }
            }
        })();
    }, []);

    const handleUpdateCategory = async ({ id, name, parentId }) => {
        await updateCategory({ id, name, parentId })
        Toast.success('Cập nhật danh mục thành công!')
    }

    const handleCreateCategory = async ({ name, parentId }) => {
        await createCategory({ name, parentId });
        Toast.success('Thêm danh mục thành công!');
        reset({ name: '', parentId: '' });
    }

    const onSubmit = async (data) => {

        if (data.parentId === '') {
            data.parentId = null;
        }

        const { name, parentId } = data;

        try {
            setIsLoading(true);
            if (isEditMode) {
                handleUpdateCategory({ id, name, parentId });
            } else {
                handleCreateCategory({ name, parentId });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Toast.error(error.response.data.error || 'Có lỗi xảy ra');
            console.error(error);
        }
    };

    const handleCancel = async () => {
        const confirmed = await ConfirmationDialog('Bạn có chắc muốn hủy không?');
        if (confirmed) {
            navigate("/admin");
        }
    };

    if (isLoading && isEditMode) {
        return <div className="text-center py-10">Đang tải...</div>;
    }

    return (
        <>

            <div className="mb-4">
                <button
                    onClick={() => { navigate("/admin") }}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FaChevronLeft className="mr-1" /> Quay lại Dashboard
                </button>
            </div>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">
                    {isEditMode ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', {
                                required: 'Vui lòng nhập tên danh mục',
                                minLength: { value: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                            Danh mục cha
                        </label>
                        <select
                            id="parentId"
                            {...register('parentId')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="">Không có danh mục cha</option>
                            {allCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLoading ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormCategory;
