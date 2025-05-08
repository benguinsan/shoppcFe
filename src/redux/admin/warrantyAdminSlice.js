import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { action_status } from "../../utils/constants/status";

const API_URL = "http://localhost/shoppc/api/";

// Async actions
export const fetchWarranties = createAsyncThunk(
  "warrantyAdmin/fetchWarranties",
  async ({ page = 0, size = 10, status = null }) => {
    let query = `page=${page}&size=${size}`;
    if (status) {
      query += `&status=${status}`;
    }
    const response = await axios.get(`${API_URL}/admin/warranties?${query}`);
    return response.data;
  }
);

export const fetchWarrantyById = createAsyncThunk(
  "warrantyAdmin/fetchWarrantyById",
  async (warrantyId) => {
    const response = await axios.get(
      `${API_URL}/admin/warranties/${warrantyId}`
    );
    return response.data;
  }
);

export const fetchWarrantyDetails = createAsyncThunk(
  "warrantyAdmin/fetchWarrantyDetails",
  async (warrantyId) => {
    const response = await axios.get(
      `${API_URL}/admin/warranties/${warrantyId}/details`
    );
    return response.data;
  }
);

export const updateWarrantyStatus = createAsyncThunk(
  "warrantyAdmin/updateWarrantyStatus",
  async ({ warrantyId, status }) => {
    const response = await axios.patch(
      `${API_URL}/admin/warranties/${warrantyId}/status`,
      { status }
    );
    return { warrantyId, status, ...response.data };
  }
);

// Initial state
const initialState = {
  warranties: [], // Danh sách bảo hành (bảng baohanh)
  selectedWarranty: null, // Chi tiết một bảo hành được chọn
  warrantyDetails: [], // Chi tiết bảo hành (từ bảng chitietbaohanh)
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
const warrantyAdminSlice = createSlice({
  name: "warrantyAdmin",
  initialState,
  reducers: {
    clearWarrantySelection: (state) => {
      state.selectedWarranty = null;
      state.warrantyDetails = [];
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWarranties
      .addCase(fetchWarranties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarranties.fulfilled, (state, action) => {
        state.loading = false;
        // Điều chỉnh theo cấu trúc phản hồi từ API, dự kiến dữ liệu bảng baohanh
        state.warranties = action.payload.content || action.payload.data || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchWarranties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchWarrantyById
      .addCase(fetchWarrantyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarrantyById.fulfilled, (state, action) => {
        state.loading = false;
        // Điều chỉnh theo cấu trúc phản hồi từ API - chi tiết một mục bảo hành
        state.selectedWarranty = action.payload.data || action.payload;
      })
      .addCase(fetchWarrantyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchWarrantyDetails
      .addCase(fetchWarrantyDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchWarrantyDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        // Điều chỉnh theo cấu trúc phản hồi từ API - danh sách chitietbaohanh
        state.warrantyDetails = action.payload.data || action.payload || [];
      })
      .addCase(fetchWarrantyDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.error.message;
      })

      // updateWarrantyStatus
      .addCase(updateWarrantyStatus.pending, (state) => {
        state.updateStatus = action_status.LOADING;
      })
      .addCase(updateWarrantyStatus.fulfilled, (state, action) => {
        state.updateStatus = action_status.SUCCEEDED;
        // Cập nhật trạng thái bảo hành trong danh sách nếu có
        if (state.warranties.length > 0) {
          const index = state.warranties.findIndex(
            (warranty) => warranty.MaBH === action.payload.warrantyId // Điều chỉnh theo tên trường MaBH
          );
          if (index >= 0) {
            state.warranties[index].TinhTrang = action.payload.status; // Điều chỉnh theo tên trường TinhTrang
          }
        }
        // Cập nhật trạng thái bảo hành được chọn nếu có
        if (
          state.selectedWarranty &&
          state.selectedWarranty.MaBH === action.payload.warrantyId // Điều chỉnh theo tên trường MaBH
        ) {
          state.selectedWarranty.TinhTrang = action.payload.status; // Điều chỉnh theo tên trường TinhTrang
        }
      })
      .addCase(updateWarrantyStatus.rejected, (state, action) => {
        state.updateStatus = action_status.FAILED;
        state.error = action.error.message;
      });
  },
});

export const { clearWarrantySelection, resetUpdateStatus } =
  warrantyAdminSlice.actions;

export default warrantyAdminSlice.reducer;
