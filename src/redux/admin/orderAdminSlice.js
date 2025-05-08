import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { action_status } from "../../utils/constants/status";

const API_URL = "http://localhost/shoppc/api/";

// Async actions
export const fetchOrders = createAsyncThunk(
  "orderAdmin/fetchOrders",
  async ({ page = 0, size = 10, status = null }) => {
    let query = `page=${page}&size=${size}`;
    if (status) {
      query += `&status=${status}`;
    }
    const response = await axios.get(`${API_URL}/admin/hoadon?${query}`);
    return response.data;
  }
);

export const fetchOrderById = createAsyncThunk(
  "orderAdmin/fetchOrderById",
  async (orderId) => {
    const response = await axios.get(`${API_URL}/admin/hoadon/${orderId}`);
    return response.data;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orderAdmin/fetchOrderDetails",
  async (orderId) => {
    const response = await axios.get(
      `${API_URL}/admin/chitiethoadon?MaHD=${orderId}`
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orderAdmin/updateOrderStatus",
  async ({ orderId, status }) => {
    const response = await axios.patch(
      `${API_URL}/admin/hoadon/${orderId}/status`,
      { TinhTrang: status }
    );
    return { orderId, status, ...response.data };
  }
);

// Initial state
const initialState = {
  orders: [],
  selectedOrder: null,
  orderDetails: [],
  loading: false,
  detailsLoading: false,
  error: null,
  updateStatus: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
};

// Slice
const orderAdminSlice = createSlice({
  name: "orderAdmin",
  initialState,
  reducers: {
    clearOrderSelection: (state) => {
      state.selectedOrder = null;
      state.orderDetails = [];
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content || action.payload.data;
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.error.message;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = action_status.LOADING;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = action_status.SUCCEEDED;
        // Cập nhật trạng thái đơn hàng trong danh sách nếu có
        if (state.orders.length > 0) {
          const index = state.orders.findIndex(
            (order) => order.MaHD === action.payload.orderId
          );
          if (index >= 0) {
            state.orders[index].TinhTrang = action.payload.status;
          }
        }
        // Cập nhật trạng thái đơn hàng được chọn nếu có
        if (
          state.selectedOrder &&
          state.selectedOrder.MaHD === action.payload.orderId
        ) {
          state.selectedOrder.TinhTrang = action.payload.status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = action_status.FAILED;
        state.error = action.error.message;
      });
  },
});

export const { clearOrderSelection, resetUpdateStatus } =
  orderAdminSlice.actions;

export default orderAdminSlice.reducer;
