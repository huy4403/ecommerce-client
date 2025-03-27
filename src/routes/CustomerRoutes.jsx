import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Login from '~/pages/auth/Login';
import Register from '~/pages/auth/Register';
import { HeaderOnly } from '~/components/Layouts';

const CustomerRoutes = [
    { path: '/', component: Home },
    { path: '/follow', component: Following, layout: HeaderOnly },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
]

export default CustomerRoutes;

