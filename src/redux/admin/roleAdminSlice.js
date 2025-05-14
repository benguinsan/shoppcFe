import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost/shoppc/api";

// Async actions
export const fetchRoles = createAsyncThunk(
  "roleAdmin/fetchRoles",
  async ({ page = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/nhomquyen`, {
        params: { page, limit },
      });
      console.log("Fetch roles response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  "roleAdmin/fetchRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/nhomquyen/${roleId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCreateRole = createAsyncThunk(
  "roleAdmin/fetchCreateRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/nhomquyen`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUpdateRole = createAsyncThunk(
  "roleAdmin/fetchUpdateRole",
  async ({ roleId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/nhomquyen/${roleId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDeleteRole = createAsyncThunk(
  "roleAdmin/fetchDeleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/nhomquyen/${roleId}`);
      return { ...response.data, deletedRoleId: roleId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thêm các action liên quan đến chức năng
export const fetchAllFunctions = createAsyncThunk(
  "roleAdmin/fetchAllFunctions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/chucnang`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFunctionById = createAsyncThunk(
  "roleAdmin/fetchFunctionById",
  async (functionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/chucnang/${functionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRoleFunctions = createAsyncThunk(
  "roleAdmin/fetchRoleFunctions",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/nhomquyen/${roleId}/chucnang`
      );
      return { ...response.data, roleId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUpdateRoleFunctions = createAsyncThunk(
  "roleAdmin/fetchUpdateRoleFunctions",
  async ({ roleId, functions }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/nhomquyen/${roleId}/chucnang`,
        { functions }
      );
      return { ...response.data, roleId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const roleAdminSlice = createSlice({
  name: "roleAdmin",
  initialState: {
    dataSource: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    loading: false,
    error: null,
    currentRole: null,
    allFunctions: [],
    roleFunctions: {},
    currentFunction: null,
  },
  reducers: {
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchRoles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSource = action.payload.dataSource || [];
        state.pageNo = action.payload.pageNo || 0;
        state.pageSize = action.payload.pageSize || 10;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchRoleById
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload.data;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchCreateRole
      .addCase(fetchCreateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateRole.fulfilled, (state, action) => {
        state.loading = false;
        // Có thể thêm logic cập nhật state sau khi tạo thành công
        if (action.payload && action.payload.success) {
          state.dataSource = [...state.dataSource, action.payload.data];
          state.totalElements += 1;
        }
      })
      .addCase(fetchCreateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchUpdateRole
      .addCase(fetchUpdateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Cập nhật nhóm quyền đã chỉnh sửa trong dataSource
          const editedRole = action.payload.data;
          const index = state.dataSource.findIndex(
            (role) => role.MaNhomQuyen === editedRole.MaNhomQuyen
          );
          if (index !== -1) {
            state.dataSource[index] = {
              ...state.dataSource[index],
              ...editedRole,
            };
          }
          // Cập nhật currentRole nếu đang xem chi tiết
          if (
            state.currentRole &&
            state.currentRole.MaNhomQuyen === editedRole.MaNhomQuyen
          ) {
            state.currentRole = {
              ...state.currentRole,
              ...editedRole,
            };
          }
        }
      })
      .addCase(fetchUpdateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchDeleteRole
      .addCase(fetchDeleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeleteRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Xóa nhóm quyền khỏi danh sách
          state.dataSource = state.dataSource.filter(
            (role) => role.MaNhomQuyen !== action.payload.deletedRoleId
          );
          state.totalElements -= 1;

          // Xóa currentRole nếu đang xem chi tiết nhóm quyền bị xóa
          if (
            state.currentRole &&
            state.currentRole.MaNhomQuyen === action.payload.deletedRoleId
          ) {
            state.currentRole = null;
          }
        }
      })
      .addCase(fetchDeleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchAllFunctions
      .addCase(fetchAllFunctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFunctions.fulfilled, (state, action) => {
        state.loading = false;
        state.allFunctions = action.payload.data || [];
      })
      .addCase(fetchAllFunctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchFunctionById
      .addCase(fetchFunctionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunctionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFunction = action.payload.data;
      })
      .addCase(fetchFunctionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchRoleFunctions
      .addCase(fetchRoleFunctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleFunctions.fulfilled, (state, action) => {
        state.loading = false;
        // Lưu danh sách chức năng của nhóm quyền vào một object với key là roleId
        state.roleFunctions = {
          ...state.roleFunctions,
          [action.payload.roleId]: action.payload.data || [],
        };
      })
      .addCase(fetchRoleFunctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xử lý fetchUpdateRoleFunctions
      .addCase(fetchUpdateRoleFunctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateRoleFunctions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Cập nhật danh sách chức năng của nhóm quyền
          state.roleFunctions = {
            ...state.roleFunctions,
            [action.payload.roleId]: action.payload.data || [],
          };
        }
      })
      .addCase(fetchUpdateRoleFunctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentRole, clearError } = roleAdminSlice.actions;
export default roleAdminSlice.reducer;
