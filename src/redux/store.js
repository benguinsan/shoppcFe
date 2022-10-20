import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";

const rootReducer = {
  user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
