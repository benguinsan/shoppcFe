import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import productReducer from "./product/productSlice";
import addressReducer from "../redux/auth/addressSlice";
import orderReducer from "../redux/order/orderSlice";

const rootReducer = {
  user: userReducer,
  address: addressReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
