import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { action_status } from "../../utils/constants/status";

// Base API URL
const API_URL = "http://localhost/shoppc/api";

// Async actions
export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async ({
    page = 1,
    limit = 10,
    searchTerm = "",
    orderBy = "MaNCC",
    orderDirection = "DESC",
    activeOnly = true,
  }) => {
    try {
      // Thêm tham số trangThai=1 nếu activeOnly=true
      let query = activeOnly ? `trangThai=1&` : "";
      query += `page=${page}&limit=${limit}`;

      if (searchTerm) {
        query += `&search=${encodeURIComponent(searchTerm)}`;
      }

      if (orderBy) {
        query += `&orderBy=${orderBy}&orderDirection=${orderDirection}`;
      }

      console.log(
        `Fetching suppliers with URL: ${API_URL}/nhacungcap?${query}`
      );
      const response = await axios.get(`${API_URL}/nhacungcap?${query}`);
      console.log("Fetch suppliers response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Fetch suppliers error:", error);
      throw error;
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  "supplier/fetchSupplierById",
  async (supplierId) => {
    try {
      const response = await axios.get(`${API_URL}/nhacungcap/${supplierId}`);
      return response.data; // Sửa lỗi ở đây, trả về response.data
    } catch (error) {
      console.error("Fetch supplier by ID error:", error);
      throw error;
    }
  }
);

export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (supplierData) => {
    try {
      const response = await axios.post(`${API_URL}/nhacungcap`, supplierData);
      return response.data;
    } catch (error) {
      console.error("Create supplier error:", error);
      throw error;
    }
  }
);

// Sử dụng phương thức POST để cập nhật nhà cung cấp
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ supplierId, supplierData }) => {
    try {
      console.log("Updating supplier:", supplierId, supplierData);

      // Xóa MaNCC để tránh xung đột
      const { MaNCC, ...dataToSend } = supplierData;

      const response = await axios.put(
        `${API_URL}/nhacungcap/${supplierId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update supplier error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  }
);

// Cập nhật phương thức và đường dẫn cho softDelete
export const softDeleteSupplier = createAsyncThunk(
  "supplier/softDeleteSupplier",
  async (supplierId) => {
    try {
      console.log("Soft deleting supplier:", supplierId);
      // Sửa thành PUT theo tài liệu API
      const response = await axios.put(
        `${API_URL}/nhacungcap/${supplierId}/soft-delete`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Soft delete response:", response.data);
      return { supplierId, response: response.data };
    } catch (error) {
      console.error("Soft delete supplier error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  }
);

// Cập nhật phương thức và đường dẫn cho restore
export const restoreSupplier = createAsyncThunk(
  "supplier/restoreSupplier",
  async (supplierId) => {
    try {
      console.log("Restoring supplier:", supplierId);
      // Sửa thành PUT theo tài liệu API
      const response = await axios.put(
        `${API_URL}/nhacungcap/${supplierId}/restore`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Restore response:", response.data);
      return { supplierId, response: response.data };
    } catch (error) {
      console.error("Restore supplier error:", error);
      throw error;
    }
  }
);

// Giữ hàm xóa thật (xóa cứng) nếu cần
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (supplierId) => {
    try {
      await axios.delete(`${API_URL}/nhacungcap/${supplierId}`);
      return supplierId;
    } catch (error) {
      console.error("Delete supplier error:", error);
      throw error;
    }
  }
);

// Initial state
const initialState = {
  suppliers: [],
  selectedSupplier: null,
  loading: false,
  error: null,
  actionStatus: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

// Slice
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSelectedSupplier: (state) => {
      state.selectedSupplier = null;
    },
    resetActionStatus: (state) => {
      state.actionStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSuppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.data;
        state.pagination = {
          current: action.payload.pagination
            ? action.payload.pagination.current_page
            : 1,
          pageSize: action.payload.pagination
            ? action.payload.pagination.per_page
            : 10,
          total: action.payload.pagination
            ? action.payload.pagination.total
            : 0,
          totalPages: action.payload.pagination
            ? action.payload.pagination.last_page
            : 0,
        };
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // fetchSupplierById
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // createSupplier
      .addCase(createSupplier.pending, (state) => {
        state.actionStatus = action_status.LOADING;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.actionStatus = action_status.SUCCEEDED;
        // Nếu đang hiển thị danh sách, thêm nhà cung cấp mới vào đầu danh sách
        if (state.suppliers.length > 0) {
          state.suppliers.unshift(action.payload.data || action.payload);
        }
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.actionStatus = action_status.FAILED;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // updateSupplier
      .addCase(updateSupplier.pending, (state) => {
        state.actionStatus = action_status.LOADING;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.actionStatus = action_status.SUCCEEDED;

        const updatedSupplier = action.payload.data || action.payload;

        // Nếu cập nhật TrangThai=0 (xóa mềm), xóa khỏi danh sách hiện tại
        if (updatedSupplier.TrangThai === 0) {
          state.suppliers = state.suppliers.filter(
            (supplier) => supplier.MaNCC !== updatedSupplier.MaNCC
          );
        } else {
          // Cập nhật nhà cung cấp trong danh sách nếu có
          const index = state.suppliers.findIndex(
            (supplier) => supplier.MaNCC === updatedSupplier.MaNCC
          );
          if (index >= 0) {
            state.suppliers[index] = updatedSupplier;
          }
        }

        // Cập nhật nhà cung cấp được chọn
        state.selectedSupplier = updatedSupplier;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.actionStatus = action_status.FAILED;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // softDeleteSupplier (mới)
      .addCase(softDeleteSupplier.pending, (state) => {
        state.actionStatus = action_status.LOADING;
        state.error = null;
      })
      .addCase(softDeleteSupplier.fulfilled, (state, action) => {
        state.actionStatus = action_status.SUCCEEDED;
        // Xóa nhà cung cấp khỏi danh sách hiển thị
        state.suppliers = state.suppliers.filter(
          (supplier) => supplier.MaNCC !== action.payload.supplierId
        );
        // Nếu nhà cung cấp đang được chọn là nhà cung cấp bị xóa, cập nhật TrangThai của nó
        if (
          state.selectedSupplier &&
          state.selectedSupplier.MaNCC === action.payload.supplierId
        ) {
          state.selectedSupplier = { ...state.selectedSupplier, TrangThai: 0 };
        }
      })
      .addCase(softDeleteSupplier.rejected, (state, action) => {
        state.actionStatus = action_status.FAILED;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // restoreSupplier (mới)
      .addCase(restoreSupplier.pending, (state) => {
        state.actionStatus = action_status.LOADING;
        state.error = null;
      })
      .addCase(restoreSupplier.fulfilled, (state, action) => {
        state.actionStatus = action_status.SUCCEEDED;
        // Nếu nhà cung cấp đang được chọn là nhà cung cấp được khôi phục, cập nhật TrangThai của nó
        if (
          state.selectedSupplier &&
          state.selectedSupplier.MaNCC === action.payload.supplierId
        ) {
          state.selectedSupplier = { ...state.selectedSupplier, TrangThai: 1 };
        }
      })
      .addCase(restoreSupplier.rejected, (state, action) => {
        state.actionStatus = action_status.FAILED;
        state.error = action.error.message || "Có lỗi xảy ra";
      })

      // deleteSupplier (xóa cứng)
      .addCase(deleteSupplier.pending, (state) => {
        state.actionStatus = action_status.LOADING;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.actionStatus = action_status.SUCCEEDED;
        // Xóa nhà cung cấp khỏi danh sách
        state.suppliers = state.suppliers.filter(
          (supplier) => supplier.MaNCC !== action.payload
        );
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.actionStatus = action_status.FAILED;
        state.error = action.error.message || "Có lỗi xảy ra";
      });
  },
});

export const { clearSelectedSupplier, resetActionStatus } =
  supplierSlice.actions;

export default supplierSlice.reducer;
