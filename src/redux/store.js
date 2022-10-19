import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { LoginReducer, RegisterReducer } from "./reducers/userReducer";

const reducer = combineReducers({
  login: LoginReducer,
  register: RegisterReducer,
});

const userInfoStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  login: { userInfo: userInfoStorage },
};
const middlewares = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);
export default store;
