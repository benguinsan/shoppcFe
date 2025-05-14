import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost/shoppc/api";

// Async actions
export const fetchUsers = createAsyncThunk(
  "userAdmin/fetchUsers",
  async ({ page = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEditUser = createAsyncThunk(
  "userAdmin/fetchEditUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "userAdmin/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState: {
    dataSource: [],
    currentUser: null,
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSource = action.payload.dataSource;
        state.pageNo = action.payload.pageNo;
        state.pageSize = action.payload.pageSize;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEditUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEditUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Find and update the edited user in dataSource
          const editedUser = action.payload.data;
          const index = state.dataSource.findIndex(
            (user) => user.MaNguoiDung === editedUser.MaNguoiDung
          );
          if (index !== -1) {
            state.dataSource[index] = {
              ...state.dataSource[index],
              ...editedUser,
            };
          }
          // Cập nhật currentUser nếu đang xem chi tiết người dùng đó
          if (
            state.currentUser &&
            state.currentUser.MaNguoiDung === editedUser.MaNguoiDung
          ) {
            state.currentUser = {
              ...state.currentUser,
              ...editedUser,
            };
          }
        }
      })
      .addCase(fetchEditUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.currentUser = action.payload.data;
        } else {
          state.error =
            action.payload?.message || "Không thể lấy thông tin người dùng";
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userAdminSlice.reducer;
