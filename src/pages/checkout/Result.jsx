import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useLocation, useParams, Navigate } from "react-router-dom";

function Result() {

    const location = useLocation();
    const isCheckout = location.state?.isCheckout;
    const status = location.state?.status;
    const { id } = useParams();

    console.log(status);
    console.log(isCheckout);

    if (!isCheckout) {
        return <Navigate to="/NotFound" replace />;
    }
    return (
        status
            ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
                >
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            {status === 'success' ? (
                                <FiCheckCircle className="text-green-500 w-20 h-20" />
                            ) : (
                                <FiXCircle className="text-red-500 w-20 h-20" />
                            )}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-gray-800 mb-4"
                        >
                            {status === 'success' ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-600 mb-8"
                        >
                            {status === 'success'
                                ? "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức."
                                : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
                        </motion.p>

                        <div className="space-y-4">
                            <Link to="/" replace>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                                hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Tiếp tục mua sắm
                                </motion.button>
                            </Link>

                            <Link to={`/order/${id}`} replace>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium
                                    hover:bg-gray-200 transition-all duration-300"
                                >
                                    Xem đơn hàng
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )
            : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
                >
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <FiCheckCircle className="text-green-500 w-20 h-20" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-gray-800 mb-4"
                        >
                            Đặt hàng thành công!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-600 mb-8"
                        >
                            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                        </motion.p>

                        <div className="space-y-4">
                            <Link to="/" replace>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                            hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Tiếp tục mua sắm
                                </motion.button>
                            </Link>

                            <Link to={`/order/${id}`} replace>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium
                            hover:bg-gray-200 transition-all duration-300"
                                >
                                    Xem đơn hàng
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )
    );
}

export default Result;
