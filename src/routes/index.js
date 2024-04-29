import { token, login} from './securityRoutes.js';
import { newUser } from './usersRoutes.js';
import { getProducts, updateProducts, updateProductsPrice, updateStocks} from './productRoutes.js';
import { getCart, addProductsToCart, removeProductFromCart } from './cartRoutes.js';
import { getOrderByReference, saveOrder, getCustomerOrders } from './orderRoutes.js';

export default [
    token, login,
    newUser,
    getProducts, updateProducts, updateProductsPrice, updateStocks,
    getCart, addProductsToCart, removeProductFromCart,
    getOrderByReference, saveOrder, getCustomerOrders
];