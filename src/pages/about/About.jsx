import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiAward, FiShield, FiTruck } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

function About() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const teamMembers = [
        {
            name: "Đoàn Văn Huy",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
            bio: "Sinh viên trường đại học tài nguyên và Môi trường Hà Nội"
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <div className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                        alt="E-commerce Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative flex flex-col items-center justify-center h-full text-white px-4">
                    <motion.img
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        src="https://images.unsplash.com/photo-1622630998477-20aa696ecb05"
                        alt="Company Logo"
                        className="w-32 h-32 mb-8 rounded-full"
                    />
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl font-bold mb-4 text-center"
                    >
                        Đoàn Huy E-commerce
                    </motion.h1>
                    <motion.p
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-xl text-center max-w-2xl"
                    >
                        Transforming online shopping with quality, convenience, and exceptional service
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-center mb-16 text-gray-800 relative">
                        <span className="relative">
                            Về Đoàn Huy Ecommerce
                            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600"></span>
                        </span>
                    </h1>

                    <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2">
                                <img
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
                                    alt="Đoàn Huy Ecommerce"
                                    className="rounded-xl shadow-lg w-full h-auto object-cover hover:shadow-2xl transition-shadow duration-300"
                                />
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-blue-600
                                to-blue-400 bg-clip-text text-transparent">Giới thiệu</h2>
                                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                                    Đoàn Huy Ecommerce là một trong những website thương mại điện tử hàng đầu,
                                    chuyên cung cấp đa dạng các mặt hàng chất lượng cao với giá cả cạnh tranh.
                                    Chúng tôi tự hào mang đến cho khách hàng trải nghiệm mua sắm trực tuyến
                                    thuận tiện, an toàn và đáng tin cậy.
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg italic border-l-4 border-blue-500 pl-4">
                                    Với phương châm "Uy tín tạo nên thương hiệu", chúng tôi cam kết mang đến
                                    những sản phẩm chính hãng, chất lượng tốt nhất đến tay người tiêu dùng.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Team Section */}
                    <section className=" mb-15 py-20 bg-gray-100 px-4 md:px-8 text-center">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-4xl font-bold mb-12 text-center">Thành viên sáng lập</h2>
                            <div className="flex justify-center">
                                {teamMembers.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl
                                        transition-shadow duration-300 max-w-sm"
                                    >
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-100 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                            <p className="text-blue-600 mb-3">{member.role}</p>
                                            <p className="text-gray-600">{member.bio}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Sứ mệnh</h2>
                                <ul className="grid grid-cols-1 gap-6">
                                    <li className="flex items-center space-x-4 text-gray-700 group">
                                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                                        <span className="text-lg group-hover:text-blue-600 transition-colors duration-300">Cung cấp đa dạng sản phẩm chất lượng cao</span>
                                    </li>
                                    <li className="flex items-center space-x-4 text-gray-700 group">
                                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                                        <span className="text-lg group-hover:text-blue-600 transition-colors duration-300">Đảm bảo giá cả cạnh tranh và hợp lý</span>
                                    </li>
                                    <li className="flex items-center space-x-4 text-gray-700 group">
                                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                                        <span className="text-lg group-hover:text-blue-600 transition-colors duration-300">Mang đến dịch vụ khách hàng xuất sắc</span>
                                    </li>
                                    <li className="flex items-center space-x-4 text-gray-700 group">
                                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                                        <span className="text-lg group-hover:text-blue-600 transition-colors duration-300">Không ngừng cải tiến và phát triển</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="md:w-1/2">
                                <img
                                    src="/images/mission.jpg"
                                    alt="Sứ mệnh của chúng tôi"
                                    className="rounded-xl shadow-lg w-full h-auto object-cover hover:shadow-2xl transition-shadow duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <FiAward className="text-6xl text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Chất Lượng</h3>
                            <p className="text-gray-600 text-lg">Cam kết 100% sản phẩm chính hãng, chất lượng được kiểm định</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <FiShield className="text-6xl text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Bảo Đảm</h3>
                            <p className="text-gray-600 text-lg">Đảm bảo hoàn tiền 100% và bồi thường nếu phát hiện hàng không chính hãng</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <FiTruck className="text-6xl text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Giao Hàng</h3>
                            <p className="text-gray-600 text-lg">Miễn phí giao hàng toàn quốc cho tất cả đơn hàng</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-xl p-10 text-white mb-8">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-8">Liên hệ với chúng tôi</h2>
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-6 hover:translate-x-2 transition-transform duration-300 group">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30">
                                            <FiMapPin className="text-2xl" />
                                        </div>
                                        <span className="text-lg">Hà Nội, Việt Nam</span>
                                    </div>
                                    <div className="flex items-center space-x-6 hover:translate-x-2 transition-transform duration-300 group">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30">
                                            <FiPhone className="text-2xl" />
                                        </div>
                                        <span className="text-lg">0924 021 021</span>
                                    </div>
                                    <div className="flex items-center space-x-6 hover:translate-x-2 transition-transform duration-300 group">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30">
                                            <FiMail className="text-2xl" />
                                        </div>
                                        <span className="text-lg">huy4403nd@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6991201366286!2d105.9351279108517!3d21.004694688523884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8cc2b344dfb%3A0x8301ee6bb3881433!2zTmcuIDkwIFRyw6J1IFF14buzLCB0dC4gVHLDonUgUXXhu7MsIEdpYSBMw6JtLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1743299050450!5m2!1svi!2s"
                                    className="w-full h-[450px] rounded-xl"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
