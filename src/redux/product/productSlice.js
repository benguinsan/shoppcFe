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
        limit = 20,
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

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: {
      data: [],
      totalPages: 0,
      currentPage: 0,
    },
    status: "idle",
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
      });
  },
});
export default productSlice.reducer;
