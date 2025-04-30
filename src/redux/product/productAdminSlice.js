import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "productAdmin/fetchProducts",
  async ({ page = 0, limit = 15 }, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost/shoppc/api/sanpham", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCreateProduct = createAsyncThunk(
  "productAdmin/fetchCreateProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost/shoppc/api/sanpham/create",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEditProduct = createAsyncThunk(
  "productAdmin/fetchEditProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost/shoppc/api/sanpham/update",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChangeStatusProduct = createAsyncThunk(
  "productAdmin/fetchChangeStatusProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost/shoppc/api/sanpham/status`,
        { MaSP: productId } // Send productId in request body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productAdminSlice = createSlice({
  name: "productAdmin",
  initialState: {
    dataSource: [],
    pageNo: 0,
    pageSize: 3,
    totalElements: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSource = action.payload.dataSource;
        state.pageNo = action.payload.pageNo;
        state.pageSize = action.payload.pageSize;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCreateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Có thể thêm logic cập nhật state sau khi tạo thành công
      })
      .addCase(fetchCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEditProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEditProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Find and update the edited product in dataSource
          const editedProduct = action.payload.data;
          const index = state.dataSource.findIndex(
            (product) => product.MaSP === editedProduct.MaSP
          );
          if (index !== -1) {
            state.dataSource[index] = {
              ...state.dataSource[index],
              ...editedProduct,
            };
          }
        }
      })
      .addCase(fetchEditProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChangeStatusProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChangeStatusProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Don't try to update state directly, just mark as success
        // The fetchProducts call will refresh the data
      })
      .addCase(fetchChangeStatusProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productAdminSlice.reducer;
