import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import vnpayLogo from '~/assets/img/vnpay.png';
import codLogo from '~/assets/img/cod.webp';
import appStoreLogo from '~/assets/img/app_store.png';
import googlePlayLogo from '~/assets/img/google_play.png';

function Footer() {
    return (
        <footer className="bg-pink-100 text-gray-700 text-sm">
            {/* Phần trên */}
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
                            className="cursor-pointer h-15"
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
