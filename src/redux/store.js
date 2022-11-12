import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import feedbackReducer from "../redux/feedback/feedbackSlice";
import filterReducer from "./product/filterSlice";

const rootReducer = {
  user: userReducer,
  cart: cartReducer,
  filter: filterReducer,
  feedback: feedbackReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
