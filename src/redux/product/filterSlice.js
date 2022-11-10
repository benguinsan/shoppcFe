import { createSlice } from "@reduxjs/toolkit";
const filterSlice = createSlice({
  name: "filter",
  initialState: { brands: [] },
  reducers: {
    refresh: (state, action) => {
      state.brands = [];
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    removeBrand: (state, action) => {
      state.brands = state.brands.filter((brand) => brand !== action.payload);
    },
  },
});

const { reducer, actions } = filterSlice;
export const { refresh, addBrand, removeBrand } = actions;
export default reducer;
