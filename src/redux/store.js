import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";

const rootReducer = {
  user: userReducer,
  cart: cartReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
