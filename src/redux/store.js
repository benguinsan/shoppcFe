import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import productReducer from "./product/productSlice";
import addressReducer from "../redux/auth/addressSlice";
import orderReducer from "../redux/order/orderSlice";
import productAdminReducer from "../redux/product/productAdminSlice";
import categoryAdminReducer from "../redux/category/categoryAdminSlice";

const rootReducer = {
  user: userReducer,
  address: addressReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  productAdmin: productAdminReducer,
  categoryAdmin: categoryAdminReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
