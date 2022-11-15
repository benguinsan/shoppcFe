import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";
import { action_status } from "../../utils/constants/status";

const orderAdapter = createEntityAdapter();

const initialState = orderAdapter.getInitialState({
  status: action_status.IDLE,
});

export const getOrder = createAsyncThunk("user/getOrder", async (payload) => {
  const response = await orderApi.getOrder(payload);
  return response.data.data;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: {
    [getOrder.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      orderAdapter.setAll(state, action.payload);
    },
    [getOrder.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
  },
});
const { actions, reducer } = orderSlice;
export const {
  selectAll: selectAllOrder,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = orderAdapter.getSelectors((state) => state.order);

export default reducer;
