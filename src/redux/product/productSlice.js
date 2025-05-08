// src/redux/features/product/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, thunkAPI) => {
    try {
      // Tạo object params chỉ chứa các key có giá trị (khác undefined và null)
      const params = {};
      const {
        page = 0,
        limit = 8,
        MaLSP,
        RAM,
        min_price,
        max_price,
        ...rest
      } = filters;

      params.page = page;
      params.limit = limit;

      if (MaLSP !== undefined && MaLSP !== null) params.MaLSP = MaLSP;
      if (RAM !== undefined && RAM !== null) params.RAM = RAM;
      if (min_price !== undefined && min_price !== null)
        params.min_price = min_price;
      if (max_price !== undefined && max_price !== null)
        params.max_price = max_price;

      // Nếu bạn có thêm các filter khác, bạn có thể thêm chúng từ `rest`
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      const response = await axios.get(
        `http://localhost/shoppc/api/sanpham/filter`,
        { params }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Lỗi khi lấy sản phẩm");
    }
  }
);

export const fetchSearch = createAsyncThunk(
  "products/fetchSearch",
  async (searchParams = {}, thunkAPI) => {
    try {
      const params = {};
      const {
        TenSP,
        MaLoaiSP,
        RAM,
        min_price,
        max_price,
        page = 1,
        limit = 10,
        ...rest
      } = searchParams;

      // Add required search params
      if (TenSP) params.TenSP = TenSP;

      // Add optional filter params
      if (MaLoaiSP) params.MaLoaiSP = MaLoaiSP;
      if (RAM) params.RAM = RAM;
      if (min_price !== undefined) params.min_price = min_price;
      if (max_price !== undefined) params.max_price = max_price;

      // Add pagination params
      params.page = page;
      params.limit = limit;

      // Add any additional search parameters
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      const response = await axios.get(`http://localhost/shoppc/api/search`, {
        params,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Lỗi khi tìm kiếm sản phẩm"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: {
      data: [],
      totalPages: 0,
      currentPage: 0,
    },
    searchResults: {
      data: [],
      totalPages: 0,
      currentPage: 0,
    },
    status: "idle",
    searchStatus: "idle",
    searchError: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // New fetchSearch cases with separate state
      .addCase(fetchSearch.pending, (state) => {
        state.searchStatus = "loading";
        state.searchError = null;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.searchError = action.payload;
      });
  },
});
export default productSlice.reducer;
