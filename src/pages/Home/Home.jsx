import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FormatCurrency from '~/components/utils/FormatCurrency';
import FreeShip from '~/assets/banner/free_ship.png';
import { Toast } from '~/components/ui/Toast';
import { getNewProduct, getFeaturedProduct } from '~/services/product/product-service';
import { getAllCategory } from '~/services/category/category-service';
import I from '~/assets/image.png';

const banners = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        title: 'Sản phẩm mới',
        description: 'Khám phá các sản phẩm mới nhất tại đây',
        link: '/products'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        title: 'Bộ sưu tập mới',
        description: 'Khám phá các xu hướng mới nhất',
        link: '/products'
    },
    {
        id: 3,
        image: FreeShip,
        title: 'Miễn phí vận chuyển',
        description: 'Cho đơn hàng mọi đơn hàng tại website',
        link: '/products'
    }
];
// https://randomuser.me/api/portraits/men/1.jpg
const testimonials = [
    {
        id: 1,
        name: 'Vũ Văn Huân',
        avatar: I,
        comment: 'Tôi rất hài lòng với dịch vụ của Đoàn Huy Ecommerce. Sản phẩm chất lượng và giao hàng nhanh chóng.',
        rating: 5
    },
    {
        id: 2,
        name: 'Phương Thảo',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        comment: 'Đã mua hàng nhiều lần và chưa bao giờ thất vọng. Nhân viên tư vấn nhiệt tình, sản phẩm đúng như mô tả.',
        rating: 5
    },
    {
        id: 3,
        name: 'Phạm Đăng Trung',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        comment: 'Giá cả hợp lý, nhiều chương trình khuyến mãi hấp dẫn. Sẽ tiếp tục ủng hộ shop trong tương lai.',
        rating: 4.5
    }
];

function Home() {
    const [newArrivals, setNewArrivals] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        (async () => {
            const response = await getNewProduct();
            setNewArrivals(response.data.data);
        })();


        (async () => {
            const response = await getFeaturedProduct();
            setFeaturedProducts(response.data.data);
        })();

        (async () => {
            const response = await getAllCategory();
            setCategories(response.data.data);
        })();

    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    };

    const testimonialSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <>
            <div className="bg-gray-50 w-full pt-18.5">
                {/* Hero Banner Slider */}
                <div className="relative w-full">
                    <Slider {...sliderSettings}>
                        {banners.map((banner) => (
                            <div key={banner.id} className="relative">
                                <div className="h-[400px] w-full relative">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-center"
                                    />
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="container mx-auto px-6 w-full">
                                            <div className="max-w-lg">
                                                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                                    {banner.title}
                                                </h1>
                                                <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-md">{banner.description}</p>
                                                <Link
                                                    to={banner.link}
                                                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg font-medium inline-flex
                                                    items-center transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                                >
                                                    Mua ngay <FiArrowRight className="ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Sản phẩm nổi bật */}
                <section className="py-20 bg-gray-50 w-full">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800">Sản Phẩm Nổi Bật</h2>
                            <Link to="/products" className="text-pink-500 hover:text-pink-600 font-medium flex items-center text-lg">
                                Xem tất cả <FiArrowRight className="ml-2" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group transform hover:-translate-y-2">
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300">
                                            <Link to={`/product/${product.id}`} className="bg-white text-pink-500 px-6 py-3 rounded-lg
                                            font-medium hover:bg-pink-500 hover:text-white transition duration-300 transform translate-y-4
                                            group-hover:translate-y-0">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-medium text-gray-800 mb-3 text-lg group-hover:text-pink-500
                                        transition-colors duration-300">{product.title}</h3>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400 mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                                                ))}
                                            </div>
                                            <span className="text-gray-600 text-sm">({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-pink-500 font-bold text-lg">Giá: {FormatCurrency(product.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Danh mục sản phẩm */}
                <section className="py-20 bg-white w-full">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Danh Mục Sản Phẩm</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                            {categories.map((category) => (
                                category.level === 1 &&
                                <Link to="/products" key={category.id} className="group">
                                    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 text-center p-6 border border-gray-100 h-full">

                                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-pink-500 transition duration-300">{category.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white w-full">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="md:w-1/2 mb-10 md:mb-0">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Giảm Giá Đặc Biệt Tháng Này</h2>
                                <p className="text-xl mb-8 text-white text-opacity-90 leading-relaxed">
                                    Đăng ký nhận thông báo để không bỏ lỡ các ưu đãi hấp dẫn từ chúng tôi.
                                </p>
                                <div className="flex max-w-md w-full">
                                    <input
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        className="px-5 py-4 rounded-l-lg focus:outline-none text-gray-800 w-full text-lg bg-white"
                                    />
                                    <button className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-r-lg font-medium transition
                                    duration-300 text-base shadow-lg hover:shadow-xl"
                                        onClick={() => {
                                            if (document.querySelector('input[type="email"]').value === '') {
                                                Toast.error('Vui lòng nhập email');
                                            } else {
                                                Toast.success('Đăng ký thành công');
                                                document.querySelector('input[type="email"]').value = '';
                                            }
                                        }}
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                            <div className="md:w-2/5">
                                <img
                                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Promotion"
                                    className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sản phẩm mới */}
                <section className="py-20 bg-white w-full">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800">Sản Phẩm Mới Nhất</h2>
                            <Link to="/products" className="text-pink-500 hover:text-pink-600 font-medium flex items-center text-lg">
                                Xem tất cả <FiArrowRight className="ml-2" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {newArrivals.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                                transition duration-300 border border-gray-100 group transform hover:-translate-y-2">
                                    <div className="relative h-72 overflow-hidden">
                                        <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-2 z-10 font-medium rounded-br-lg">Mới</div>
                                        <img
                                            src={product.image}
                                            alt={product.tilte}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300">
                                            <Link to={`/product/${product.id}`} className="bg-white text-pink-500 px-6 py-3 rounded-lg
                                            font-medium hover:bg-pink-500 hover:text-white transition duration-300 transform translate-y-4
                                            group-hover:translate-y-0">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-medium text-gray-800 mb-3 text-lg group-hover:text-pink-500
                                        transition-colors duration-300">{product.title}</h3>
                                        <div className="flex items-center">
                                            <span className="text-pink-500 font-bold text-lg">Giá: {FormatCurrency(product.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Đánh giá khách hàng */}
                <section className="py-20 bg-gray-50 w-full cursor-pointer">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                        <div className="max-w-4xl mx-auto">
                            <Slider {...testimonialSettings}>
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="px-4">
                                        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-pink-100 shadow-md"
                                            />
                                            <div className="flex justify-center mb-6 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`${i < testimonial.rating ? "fill-current" : ""} text-xl mx-0.5`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 italic mb-6 text-lg leading-relaxed">"{testimonial.comment}"</p>
                                            <h4 className="font-semibold text-gray-800 text-xl">{testimonial.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
