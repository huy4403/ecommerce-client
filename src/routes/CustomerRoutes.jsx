import Home from '~/pages/Home/Home';
import Login from '~/pages/auth/Login';
import Register from '~/pages/auth/Register';
import { DefaultLayout } from '~/components/Layouts';
import ProductDetail from '~/pages/product/ProductDetail';
import Products from '~/pages/product/Products';
import Profile from '~/pages/profile/Profile';
import Orders from '~/pages/orders/Orders';
import OrderDetail from '~/pages/orders/OrderDetail';
import Cart from '~/pages/cart/Cart';
import Checkout from '~/pages/checkout/Checkout';
import About from '~/pages/about/About';
import NotFound from '~/NotFound';
import Result from '~/pages/checkout/Result';
import ProcessCheckout from '~/pages/checkout/ProcessCheckout';

const CustomerRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/product/:id', component: ProductDetail, layout: DefaultLayout },
    { path: '/products', component: Products, layout: DefaultLayout },
    { path: '/profile', component: Profile, layout: DefaultLayout },
    { path: '/orders', component: Orders, layout: DefaultLayout },
    { path: '/order/:id', component: OrderDetail, layout: DefaultLayout },
    { path: '/cart', component: Cart, layout: DefaultLayout },
    { path: '/checkout', component: Checkout, layout: DefaultLayout },
    { path: '/about', component: About, layout: DefaultLayout },
    { path: '*', component: NotFound, layout: null },
    { path: '/order/result/:id', component: Result, layout: DefaultLayout },
    { path: '/processing-checkout', component: ProcessCheckout, layout: null },
]

export default CustomerRoutes;

