import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import productReducer from "./product/productSlice";
import addressReducer from "../redux/auth/addressSlice";
import orderReducer from "../redux/order/orderSlice";
import orderAdminReducer from "../redux/admin/orderAdminSlice";
import warrantyAdminReducer from "../redux/admin/warrantyAdminSlice";
import supplierReducer from "../redux/admin/supplierSlice";
import productAdminReducer from "../redux/product/productAdminSlice";
import categoryAdminReducer from "../redux/category/categoryAdminSlice";
import accountAdminReducer from "../redux/admin/accountAdminSlice";
import userAdminReducer from "../redux/admin/userAdminSlice";
import roleAdminReducer from "../redux/admin/roleAdminSlice";

const rootReducer = {
  user: userReducer,
  address: addressReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  orderAdmin: orderAdminReducer,
  warrantyAdmin: warrantyAdminReducer,
  supplier: supplierReducer,
  productAdmin: productAdminReducer,
  categoryAdmin: categoryAdminReducer,
  accountAdmin: accountAdminReducer,
  userAdmin: userAdminReducer,
  roleAdmin: roleAdminReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
