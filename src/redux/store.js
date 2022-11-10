import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import filterReducer from "./product/filterSlice";

const rootReducer = {
  user: userReducer,
  cart: cartReducer,
  filter: filterReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
