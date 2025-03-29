import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import vnpayLogo from '~/assets/img/vnpay.png';
import codLogo from '~/assets/img/cod.webp';
import appStoreLogo from '~/assets/img/app_store.png';
import googlePlayLogo from '~/assets/img/google_play.png';

function Footer() {
    return (
        <footer className="bg-pink-100 text-gray-700 text-sm">

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Sản Phẩm Chính Hãng</h3>
                            <p className="text-gray-600">Cam kết 100% sản phẩm chính hãng, nguồn gốc rõ ràng</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Giao Hàng Nhanh Chóng</h3>
                            <p className="text-gray-600">Giao hàng toàn quốc từ 1-7 ngày làm việc</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Bảo Hành Dài Hạn</h3>
                            <p className="text-gray-600">Chính sách bảo hành lên đến 24 tháng</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Thanh Toán An Toàn</h3>
                            <p className="text-gray-600">Nhiều phương thức thanh toán an toàn, bảo mật</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Cột 1 */}
                <div>
                    <h3 className="font-bold mb-4">Trung Tâm Trợ Giúp</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-orange-500">Doan Huy Ecommerce Blog</a></li>
                        <li><a href="#" className="hover:text-orange-500">Hướng Dẫn Mua Hàng</a></li>
                        <li><a href="#" className="hover:text-orange-500">Hướng Dẫn Bán Hàng</a></li>
                        <li><a href="#" className="hover:text-orange-500">Doan Huy Ecommerce Xu</a></li>
                        <li><a href="#" className="hover:text-orange-500">Liên Hệ Doan Huy Shop</a></li>
                    </ul>
                </div>

                {/* Cột 2 */}
                <div>
                    <h3 className="font-bold mb-4">Về Đoàn Huy Ecommerce</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-orange-500">Giới Thiệu</a></li>
                        <li><a href="#" className="hover:text-orange-500">Tuyển Dụng</a></li>
                        <li><a href="#" className="hover:text-orange-500">Điều Khoản Doan Huy Ecommerce</a></li>
                        <li><a href="#" className="hover:text-orange-500">Chính Sách Bảo Mật</a></li>
                        <li><a href="#" className="hover:text-orange-500">Liên Hệ Truyền Thông</a></li>
                    </ul>
                </div>

                {/* Cột 3: Thanh toán */}
                <div>
                    <h3 className="font-bold mb-4">Phương Thức Thanh Toán</h3>
                    <div className="block gap-3 ml-13 flex-wrap">
                        <img
                            src={vnpayLogo} className="h-8 cursor-pointer"
                            alt="Thanh toán VNPAY"
                            title="Thanh toán VNPay"
                        />
                        <img
                            src={codLogo}
                            className="cursor-pointer h-15 mt-10"
                            alt="Thanh toán khi nhận hàng"
                            title="Thanh toán khi nhận hàng"
                        />
                    </div>
                </div>

                {/* Cột 4: Mạng xã hội & ứng dụng */}
                <div>
                    <h3 className="font-bold mb-4">Theo Dõi Chúng Tôi</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com/huy4403" target="_blank" className="text-xl hover:text-blue-600"><FaFacebook /></a>
                        <a href="https://facebook.com/huy4403" className="text-xl hover:text-pink-500"><FaInstagram /></a>
                        <a href="https://facebook.com/huy4403" className="text-xl hover:text-blue-500"><FaLinkedin /></a>
                    </div>
                    <h3 className="font-semibold mt-6 mb-4">Tải Ứng Dụng Ecommerce</h3>
                    <div className="flex gap-3">
                        <img src={appStoreLogo} className="h-4 cursor-pointer" alt="App Store" />
                        <img src={googlePlayLogo} className="h-4 cursor-pointer" alt="Google Play" />
                    </div>
                </div>
            </div>
            <div className="bg-pink-100 text-center py-4 border-t-1">
                <p>© 2025 Đoàn Huy Ecommerce. Tất cả các quyền được bảo lưu.</p>
                <p className="text-xs mt-2">Đoàn Huy Ecommerce - Địa chỉ: Hà Nội, Việt Nam.</p>
            </div>
        </footer>
    );
}

export default Footer;
