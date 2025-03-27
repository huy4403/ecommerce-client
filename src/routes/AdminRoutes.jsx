import Index from '~/pages/admin/index';
import ProductForm from '~/pages/admin/ProductManagement/ProductForm';
import ProductUpdateForm from '~/pages/admin/ProductManagement/UpdateProductForm';
import FormCategory from '~/pages/admin/CategoryManagement/FormCategory';
import OrderDetail from '~/pages/admin/OrderManagement/OrderDetail';

const AdminRoutes = [
    { path: '/admin', component: Index, layout: null },
    { path: '/admin/product', component: ProductForm, layout: null },
    { path: '/admin/product/:id', component: ProductUpdateForm, layout: null },
    { path: '/admin/category', component: FormCategory, layout: null },
    { path: '/admin/category/:id', component: FormCategory, layout: null },
    { path: '/admin/order/:id', component: OrderDetail, layout: null }
]

export default AdminRoutes;
