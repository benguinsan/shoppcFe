import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = "http://localhost/shoppc/api";

// Async actions
export const fetchAccounts = createAsyncThunk(
  "accountAdmin/fetchAccounts",
  async ({ page = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCreateAccount = createAsyncThunk(
  "accountAdmin/fetchCreateAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/accounts`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEditAccount = createAsyncThunk(
  "accountAdmin/fetchEditAccount",
  async ({ accountId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/accounts/${accountId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChangeStatusAccount = createAsyncThunk(
  "accountAdmin/fetchChangeStatusAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/accounts/${accountId}/status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  "accountAdmin/fetchAccountById",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const accountAdminSlice = createSlice({
  name: "accountAdmin",
  initialState: {
    dataSource: [],
    currentAccount: null,
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSource = action.payload.dataSource;
        state.pageNo = action.payload.pageNo;
        state.pageSize = action.payload.pageSize;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCreateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Có thể thêm logic cập nhật state sau khi tạo thành công
      })
      .addCase(fetchCreateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEditAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEditAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Find and update the edited account in dataSource
          const editedAccount = action.payload.data;
          const index = state.dataSource.findIndex(
            (account) => account.MaTK === editedAccount.MaTK
          );
          if (index !== -1) {
            state.dataSource[index] = {
              ...state.dataSource[index],
              ...editedAccount,
            };
          }
          // Cập nhật currentAccount nếu đang xem chi tiết tài khoản đó
          if (state.currentAccount && state.currentAccount.MaTK === editedAccount.MaTK) {
            state.currentAccount = {
              ...state.currentAccount,
              ...editedAccount,
            };
          }
        }
      })
      .addCase(fetchEditAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChangeStatusAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChangeStatusAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Don't try to update state directly, just mark as success
        // The fetchAccounts call will refresh the data
      })
      .addCase(fetchChangeStatusAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.currentAccount = action.payload.data;
        } else {
          state.error = action.payload?.message || "Không thể lấy thông tin tài khoản";
        }
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default accountAdminSlice.reducer;
