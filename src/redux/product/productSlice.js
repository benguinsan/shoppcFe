import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import productApi from "../../api/productApi";
import { action_status } from "../../utils/constants/status";

const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState({
  status: action_status.IDLE,
});

export const getProduct = createAsyncThunk("user/getProduct", async () => {
  const response = await productApi.getAllProduct();
  return response.data.data;
});

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: {
    [getProduct.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      productAdapter.setAll(state, action.payload);
    },
    [getProduct.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
  },
});
const { actions, reducer } = productSlice;
export const {
  selectAll: selectAllProduct,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productAdapter.getSelectors((state) => state.product);

export default reducer;
