import { addAttribute, getAttribute } from "~/services/admin/product-service";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import { Toast } from "~/components/ui/toast";

function AttributeManagement({ id, attributes, setAttributes }) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAttribute(id);
                setAttributes(res.data.data);
            } catch (err) {
                console.log(err);
                Toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
            }
        })();
    }, [id]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        mode: 'onChange'
    });

    const name = watch("name");

    const handleAddAttribute = async (id, name) => {
        try {
            setLoading(true);
            const res = await addAttribute(id, name);
            setAttributes([...attributes, { id: res.data.data, name }]);
            Toast.success("Thêm thành công thuộc tính " + name);
            setValue("name", "");
        } catch (err) {
            Toast.error(err.response.data.error)
        } finally {
            setLoading(false);
        }
    }

    const onSubmitAddAttribute = (data) => {
        const { name } = data;
        ConfirmationDialog("Bạn có muốn thêm thuộc tính này cho sản phẩm không")
            .then((result) => {
                if (result) {
                    handleAddAttribute(id, name);
                }
            });
    }

    return (
        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thuộc tính sản phẩm</h3>
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <div className="flex gap-4 mb-4">

                    <form onSubmit={handleSubmit(onSubmitAddAttribute)}
                        className="bg-white shadow-lg rounded-lg p-6 flex flex-col w-full">
                        <div className="flex w-full">
                            <div className="flex-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên thuộc tính</label>
                                <input
                                    type="text"
                                    placeholder="Tên thuộc tính (e.g., Size)"
                                    className={`w-full rounded-md border-gray-300 px-2 py-2 ${errors.name ? 'border-red-500' : ''}`}
                                    {...register("name", {
                                        required: "Tên thuộc tính không được để trống"
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !name}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-md ml-4 h-10 mt-5 
                                ${(loading || !name) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                            `}
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {attributes.length > 0 ? (
                        attributes.map((attr) => (
                            <div key={attr.id} className="p-3 border rounded-md">
                                <h4 className="font-medium">{attr.name}</h4>
                            </div>
                        ))
                    ) : (
                        <h4 className="font-medium">Sản phẩm không có thuộc tính</h4>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AttributeManagement;