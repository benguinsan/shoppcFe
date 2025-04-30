import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async () => {
    const res = await axios.get("http://localhost/shoppc/api/loaisanpham");
    return res.data;
  }
);

export const fetchCreateCategory = createAsyncThunk(
  "category/fetchCreateCategory",
  async (data) => {
    const res = await axios.post(
      "http://localhost/shoppc/api/loaisanpham",
      data
    );
    return res.data;
  }
);

export const fetchUpdateCategory = createAsyncThunk(
  "category/fetchUpdateCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost/shoppc/api/loaisanpham/${data.MaLoaiSP}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDeleteCategory = createAsyncThunk(
  "category/fetchDeleteCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost/shoppc/api/loaisanpham/${data.MaLoaiSP}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categoryAdminSlice = createSlice({
  name: "categoryAdmin",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCreateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCreateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUpdateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          // Update the category in items array
          const index = state.items.data.findIndex(
            (cat) => cat.MaLoaiSP === action.payload.data.MaLoaiSP
          );
          if (index !== -1) {
            state.items.data[index] = action.payload.data;
          }
        }
      })
      .addCase(fetchUpdateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDeleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Delete response:", action.payload); // Debug log

        if (
          action.payload?.success &&
          action.payload?.data?.MaLoaiSP &&
          state.items?.data
        ) {
          state.items.data = state.items.data.filter(
            (item) => item.MaLoaiSP !== action.payload.data.MaLoaiSP
          );
        }
      })
      .addCase(fetchDeleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoryAdminSlice.reducer;
