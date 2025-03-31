import { useState, useEffect, useContext } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { getUserCart, deleteCartItem, updateCartItemQuantity } from "~/services/cart/cart-service";
import FormatCurrency from "~/components/utils/formatCurrency";
import { Link } from "react-router-dom";
import { Toast } from "~/components/ui/toast";
import { Context } from "~/ContextProvider";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartItemSelected, setCartItemSelected] = useState([]);

    const context = useContext(Context);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getUserCart();
                setCartItems(response.data.data.cartItems.map(item => ({ ...item, selected: false })));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    useEffect(() => {
        const newTotal = cartItems
            .filter((item) => item.selected)
            .reduce((sum, item) => sum + item.price * item.quantityBuy, 0);
        setTotal(newTotal);

        const selectedItems = cartItems.filter(item => item.selected);
        setCartItemSelected(selectedItems);
    }, [cartItems]);

    const handleQuantityChange = async (id, quantity) => {

        const prevCartItems = [...cartItems];

        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = item.quantityBuy + quantity;
                    if (newQuantity >= 1 && newQuantity <= item.stock) {
                        return { ...item, quantityBuy: newQuantity };
                    }
                }
                return item;
            })
        );

        try {
            await updateCartItemQuantity(id, quantity);
        } catch (error) {
            setCartItems(prevCartItems);
            Toast.error("Không thể cập nhật số lượng sản phẩm");
        }
    };

    const handleSelectItem = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await deleteCartItem(id);
            console.log(response);
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
            context.setCartCount(context.cartCount - 1);
        } catch (error) {
            console.error("Failed to delete cart item:", error);
            Toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
        }
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(prevItems =>
            prevItems.map(item => ({ ...item, selected: newSelectAll }))
        );
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 pb-8 pt-26.5 max-w-4xl"
        >
            <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Giỏ hàng trống</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700
                    mt-10 transition-all">
                        <Link to="/">
                            Tiếp tục mua hàng
                        </Link>
                    </button>
                </div>
            ) : (
                <div className="space-y-4 mb-24">
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all accent-blue-500"
                        />
                        <span className="ml-2">Chọn tất cả</span>
                    </div>

                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center bg-white p-3 rounded-lg shadow cursor-pointer"
                            onClick={() => handleSelectItem(item.id)}
                        >
                            <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => handleSelectItem(item.id)}
                                className="h-4 w-4 text-blue-600 mr-3 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all accent-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <div className="w-20 h-20">
                                <img
                                    src={item.productImageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            <div className="flex-1 ml-3">
                                <Link
                                    to={`/product/${item.productId}`}
                                    className="text-base font-semibold hover:text-red-600 transition-colors"
                                    title="Xem sản phẩm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.title}
                                </Link>
                                <div className="text-sm text-gray-600 mt-1">
                                    {item.attributeValues.map((attr, index) => (
                                        <span key={attr.id}>
                                            {attr.value}
                                            {index < item.attributeValues.length - 1 ? ' - ' : ''}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-blue-600 font-bold mt-1">
                                    {FormatCurrency(item.price)}
                                </p>
                            </div>

                            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                                    disabled={item.quantityBuy <= 1}
                                >
                                    <FiMinus />
                                </motion.button>
                                <span className="w-8 text-center font-medium">{item.quantityBuy}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                                    disabled={item.quantityBuy >= item.stock}
                                >
                                    <FiPlus />
                                </motion.button>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-4 p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id);
                                }}
                            >
                                <FiTrash2 size={18} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            )}

            <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
            >
                <div className="container mx-auto flex justify-between items-center max-w-4xl">
                    <div>
                        <p className="text-sm text-gray-600">Tổng thanh toán:</p>
                        <motion.p
                            className="text-xl font-bold text-blue-600"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            {FormatCurrency(total)}
                        </motion.p>
                    </div>
                    <Link to="/checkout" state={{ isCheckout: true }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!cartItems.some(item => item.selected)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium
                            hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
                            w-45 md:w-100 lg:w-auto mr-13 md:mr-13 lg:mr-0"
                            onClick={() => {
                                localStorage.setItem('items', JSON.stringify(cartItemSelected));
                                sessionStorage.setItem('isCheckout', true);
                            }}
                        >
                            Đặt hàng ({cartItemSelected.length})
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Cart;
