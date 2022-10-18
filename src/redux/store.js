import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { authReducer } from "./reducers/authReducer";
import thunk from "redux-thunk";

const reducer = combineReducers({
  auth: authReducer,
});
// let initialState = {};
const middlewares = [thunk];
const store = createStore(reducer, compose(applyMiddleware(...middlewares)));
export default store;
