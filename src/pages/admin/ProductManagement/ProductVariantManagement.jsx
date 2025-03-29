import { useState, useEffect } from "react";
import { Toast } from "~/components/ui/toast";
import { FiPlus, FiX } from "react-icons/fi";
import { addVariant, getVariants, updateQuantityVariant, deleteVariant, activeVariant } from "~/services/admin/product-service";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";

function ProductVariantManagement({ id, attributes }) {

    // const [attributes, setAttributes] = useState();
    const [variants, setVariants] = useState([]);
    const [newVariants, setNewVariants] = useState([]);
    const [editingQuantity, setEditingQuantity] = useState({});

    const handleRemoveAttributeFromVariant = (variantIndex) => {
        const updatedVariants = [...newVariants];
        updatedVariants[variantIndex].attributes.splice(variantIndex, 1);
        setNewVariants(updatedVariants);
    }

    const handleAddVariant = () => {
        // Only add new variant if there are no empty variants
        const hasEmptyVariant = newVariants.some(variant =>
            variant.attributes.length === 0 ||
            variant.quantity === 0 ||
            variant.attributes.some(attr => !attr.id || !attr.value)
        );

        if (!hasEmptyVariant) {
            setNewVariants([{
                productId: id,
                attributes: [],
                quantity: 0
            }, ...newVariants]);
        } else {
            Toast.error("Vui lòng hoàn thành biến thể hiện tại trước khi thêm mới");
        }
    }

    const handleRemoveVariant = (variantIndex) => {
        const updatedVariants = [...newVariants];
        updatedVariants.splice(variantIndex, 1);
        setNewVariants(updatedVariants);
    }

    const handleAddAttributeToVariant = (variantIndex) => {
        const currentVariant = newVariants[variantIndex];

        const hasIncompleteAttribute = currentVariant.attributes.some(attr =>
            !attr.id || !attr.value
        );

        if (!hasIncompleteAttribute) {
            const updatedVariants = [...newVariants];
            updatedVariants[variantIndex].attributes.push({
                id: '',
                name: '',
                value: ''
            });
            setNewVariants(updatedVariants);
        } else {
            Toast.error("Vui lòng hoàn thành thuộc tính hiện tại trước khi thêm mới");
        }
    }

    const handleConfirmVariant = async (variantIndex) => {
        const variant = newVariants[variantIndex];
        if (!variant.quantity || variant.quantity <= 0) {
            Toast.error("Số lượng phải lớn hơn 0");
            return;
        }
        if (variant.attributes.some(attr => !attr.id || !attr.value)) {
            Toast.error("Vui lòng điền đầy đủ thông tin thuộc tính");
            return;
        }

        const transformedVariant = {
            productId: variant.productId,
            attributeValues: variant.attributes.map(attr => ({
                attributeId: attr.id,
                value: attr.value
            })),
            quantity: variant.quantity
        };

        ConfirmationDialog("Bạn có chắc chắn muốn thêm biến thể")
            .then(async (result) => {
                if (result) {
                    try {
                        await addVariant(transformedVariant);
                        Toast.success("Thêm biến thể thành công")

                        const resVariant = await getVariants(id);
                        setVariants(resVariant.data.data || []);

                        handleRemoveVariant(variantIndex);
                    } catch (err) {
                        if (err.response.data.error == "Product variant already exists") {

                            Toast.error("Biến thể đã tồn tại");
                        }
                        else {
                            Toast.error("Lỗi khi thêm biến thể");
                        }
                    }
                }
            })
    }

    const handleDeleteVariant = (variantId) => {
        ConfirmationDialog("Bạn có chắc chắn muốn ngừng kinh doanh biến thể này?")
            .then(async (result) => {
                if (result) {
                    try {
                        await deleteVariant(variantId);
                        Toast.success("Ngừng kinh doanh biến thể thành công");
                        // Refresh variants after deleting
                        const resVariant = await getVariants(id);
                        setVariants(resVariant.data.data || []);
                    } catch (err) {
                        console.log(err);
                        Toast.error("Lỗi khi ngừng kinh doanh biến thể");
                    }
                }
            });
    }

    const handleActiveVariant = (variantId) => {
        ConfirmationDialog("Bạn có chắc chắn muốn mở kinh doanh biến thể này?")
            .then(async (result) => {
                if (result) {
                    try {
                        await activeVariant(variantId);
                        Toast.success("Mở kinh doanh biến thể thành công");
                        // Refresh variants after activating
                        const resVariant = await getVariants(id);
                        setVariants(resVariant.data.data || []);
                    } catch (err) {
                        console.log(err);
                        Toast.error("Lỗi khi mở kinh doanh biến thể");
                    }
                }
            });
    }

    const handleUpdateQuantity = (variantId, isIncrease) => {
        const newQuantity = editingQuantity[variantId];
        if (!newQuantity || newQuantity <= 0) {
            Toast.error("Số lượng phải lớn hơn 0");
            return;
        }

        const quantityToUpdate = isIncrease ? newQuantity : -newQuantity;

        ConfirmationDialog(`Bạn có chắc chắn muốn ${isIncrease ? 'tăng' : 'giảm'} ${Math.abs(newQuantity)} sản phẩm?`)
            .then(async (result) => {
                if (result) {
                    try {
                        await updateQuantityVariant(variantId, quantityToUpdate);
                        Toast.success(`${isIncrease ? 'Tăng' : 'Giảm'} số lượng biến thể thành công`);
                        const resVariant = await getVariants(id);
                        setVariants(resVariant.data.data || []);
                        setEditingQuantity(prev => {
                            const updated = { ...prev };
                            delete updated[variantId];
                            return updated;
                        });
                    } catch (err) {
                        console.log(err);
                        Toast.error(`Lỗi khi ${isIncrease ? 'tăng' : 'giảm'} số lượng biến thể`);
                    }
                }
            });
    }

    useEffect(() => {
        (async () => {
            try {
                const resVariant = await getVariants(id);
                setVariants(resVariant.data.data || []);
            } catch (err) {
                console.log(err);
                Toast.error("Lỗi khi lấy sản phẩm");
            }
        })();
    }, [id]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Biến thể sản phẩm</h3>
                <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                    duration-200 flex items-center shadow-sm"
                >
                    <FiPlus className="mr-2" /> Thêm biến thể
                </button>

            </div>
            {newVariants.map((variant, variantIndex) => (
                <div key={variantIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm
                hover:shadow-md transition-shadow duration-200 mb-4">
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={() => handleRemoveVariant(variantIndex)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors duration-200"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {variant.id && <div className="text-sm text-gray-500 mb-2">ID: {variant.id}</div>}
                        {variant.attributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className="flex gap-4 items-center">
                                <select
                                    className="rounded-lg border-gray-300 flex-1 px-4 py-2 focus:ring-2 focus:ring-indigo-500
                                    focus:border-indigo-500 transition-all duration-200"
                                    value={attr.id}
                                    onChange={(e) => {
                                        const selectedAttribute = attributes.find(a => a.id === parseInt(e.target.value));
                                        const attributeExists = variant.attributes.some(
                                            (existingAttr, idx) => idx !== attrIndex && existingAttr.id === selectedAttribute.id
                                        );

                                        if (attributeExists) {
                                            Toast.error("Thuộc tính này đã tồn tại trong biến thể");
                                            return;
                                        }

                                        const updatedVariants = [...newVariants];
                                        updatedVariants[variantIndex].attributes[attrIndex] = {
                                            ...attr,
                                            id: selectedAttribute.id,
                                            name: selectedAttribute.name
                                        };
                                        setNewVariants(updatedVariants);
                                    }}
                                >
                                    <option value="" className="text-gray-400">Chọn thuộc tính</option>
                                    {attributes && attributes.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Giá trị thuộc tính"
                                    className="rounded-lg border-gray-300 flex-1 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    value={attr.value}
                                    onChange={(e) => {
                                        const updatedVariants = [...newVariants];
                                        updatedVariants[variantIndex].attributes[attrIndex].value = e.target.value;
                                        setNewVariants(updatedVariants);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAttributeFromVariant(variantIndex, attrIndex)}
                                    className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors duration-200"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6 items-center mt-6 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                            <button
                                type="button"
                                onClick={() => handleAddAttributeToVariant(variantIndex)}
                                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center text-sm"
                            >
                                <FiPlus className="mr-2" /> Thêm thuộc tính
                            </button>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                            <input
                                type="number"
                                placeholder="Nhập số lượng"
                                className="rounded-lg border-gray-300 w-40 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                value={variant.quantity}
                                id="quantity"
                                onChange={(e) => {
                                    const updatedVariants = [...newVariants];
                                    updatedVariants[variantIndex].quantity = parseInt(e.target.value);
                                    setNewVariants(updatedVariants);
                                }}
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => handleConfirmVariant(variantIndex)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="space-y-6">
                {/* Existing variants - read only */}
                {variants.map((variant) => (
                    <div key={variant.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500 mb-2">ID: {variant.id}</div>
                            {variant.attributes.map((attr, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-300">
                                        {attr.name}
                                    </div>
                                    <div className="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-300">
                                        {attr.value}
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-4 items-center mt-4 pt-4 border-t border-gray-200">
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-700">Số lượng tồn kho:</span>
                                    {editingQuantity[variant.id] !== undefined ? (
                                        <div className="flex items-center mt-1">
                                            <div className="flex items-center">
                                                <span className="text-xl text-gray-600 mr-2">{variant.quantity}</span>
                                                <input
                                                    type="number"
                                                    className="rounded-lg border-gray-300 w-24 px-2 py-1
                                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                                    transition-all duration-200 border-2"
                                                    placeholder="Nhập số lượng"
                                                    value={editingQuantity[variant.id]}
                                                    onChange={(e) => setEditingQuantity({
                                                        ...editingQuantity,
                                                        [variant.id]: parseInt(e.target.value)
                                                    })}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(variant.id, false)}
                                                className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                                            >
                                                giảm
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(variant.id, true)}
                                                className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                                            >
                                                Tăng
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingQuantity(prev => {
                                                    const updated = { ...prev };
                                                    delete updated[variant.id];
                                                    return updated;
                                                })}
                                                className="ml-1 px-2 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="ml-2">{variant.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setEditingQuantity({
                                                    ...editingQuantity,
                                                    [variant.id]: variant.quantity
                                                })}
                                                className="ml-2 text-blue-600 text-xs hover:text-blue-800"
                                            >
                                                Chỉnh sửa
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${variant.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {variant.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                                    </span>
                                </div>
                                {variant.status === 'ACTIVE' ? (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVariant(variant.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                        >
                                            Ngừng kinh doanh
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleActiveVariant(variant.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                                        >
                                            Mở kinh doanh
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {variants.length === 0 && newVariants.length === 0 && (
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                        <h3 className="text-xl font-medium text-gray-500">Chưa có biến thể nào</h3>
                        <p className="text-gray-400 mt-2">Nhấn "Thêm biến thể" để bắt đầu</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default ProductVariantManagement;
