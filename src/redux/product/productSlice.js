import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";
import { action_status } from "../../utils/constants/status";

const initialState = {
  status: action_status.IDLE,
  statusId: action_status.IDLE,
  totalPage: null,
  product: {},
  productId: {},
};

export const getProduct = createAsyncThunk(
  "user/getProduct",
  async (payload) => {
    const query = `page=${payload.page}&limit=${payload.limit}`;
    const response = await productApi.getAllProduct(query);
    return response.data;
  }
);

export const getProductId = createAsyncThunk(
  "user/getProductId",
  async (payload) => {
    const response = await productApi.getProductId(payload);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: {
    [getProduct.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.product = action.payload.data;
      state.totalPage = action.payload.totalPage;
    },
    [getProduct.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [getProductId.pending]: (state, action) => {
      state.statusId = action_status.LOADING;
    },
    [getProductId.fulfilled]: (state, action) => {
      state.statusId = action_status.SUCCEEDED;
      state.productId = action.payload.data;
    },
    [getProductId.rejected]: (state, action) => {
      state.statusId = action_status.FAILED;
    },
  },
});
const { actions, reducer } = productSlice;
export default reducer;
