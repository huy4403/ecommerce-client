import { getAllCategory } from "~/services/category/category-service";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { deleteCategory } from "~/services/admin/category-service";
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
function CategoryManagement() {

    localStorage.setItem("activeSection", "categories");

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await getAllCategory();
            console.log(response);
            setCategories(response.data.data);
        })();
    }, [isLoading]);

    const handleDeleteCategory = async (id) => {
        ConfirmationDialog('Bạn có chắc muốn xóa danh mục này không?')
            .then(async (confirmed) => {
                if (confirmed) {
                    try {
                        await deleteCategory({ id });
                        Toast.success('Xóa danh mục thành công!');
                        setIsLoading(!isLoading);
                    } catch (error) {
                        console.log(error);
                        Toast.error('Không thể xóa danh mục này vẫn còn sản phẩm thuộc danh mục này!');
                    }
                }
            })
    }

    const renderCategoryTree = (categories, depth = 0) => {
        return categories.map((category) => (
            <div key={category.id} className="relative">
                <div className={`border dark:border-gray-700 rounded-lg p-4 ${depth > 0 ? "ml-8" : ""} 
              hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800/50 
              ${depth > 0 ? "before:absolute before:w-6 before:h-px before:bg-gray-300 before:dark:bg-gray-600 before:left-[-24px] before:top-[50%]" : ""}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white">{category.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                    Danh mục cấp {category.level}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {category.childrenCategories.length} danh mục con
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full 
                            transition-colors cursor-pointer"
                                title="Sửa danh mục">
                                <Link to={`/admin/category/${category.id}`}><FiEdit2 size={16} /></Link>
                            </button>
                            <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors cursor-pointer"
                                title="Xóa danh mục"
                                onClick={() => handleDeleteCategory(category.id)}
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    </div>
                    {category.childrenCategories.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            {renderCategoryTree(category.childrenCategories, depth + 1)}
                        </div>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Danh mục sản phẩm</h2>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                flex items-center gap-2 transition-colors cursor-pointer">
                        <Link to="/admin/category" className="flex items-center gap-2"><FiPlus size={18} /> Thêm danh mục</Link>
                    </button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 shadow-lg">
                    <div className="space-y-4">
                        {renderCategoryTree(categories)}
                    </div>
                </div>
            </div>
        </>
    )
}
export default CategoryManagement;