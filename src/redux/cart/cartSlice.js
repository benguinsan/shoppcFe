import { createSlice } from "@reduxjs/toolkit";
import { create } from "yup/lib/boolean";

const cartSlice = createSlice({
  name: "cart",
  initialState: {},
  reducers: {
    addToCart(state, action) {
      // newItems = {id,product,quantity}
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const newItem = action.payload;
      console.log(newItem);
      const index = cart.findIndex((x) => x.id === newItem.id);
      if (index >= 0) {
        cart[index].quantity += newItem.quantity;
      } else {
        cart.push(newItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const index = state.cartItems.findIndex((x) => x.id === id);
      if (index >= 0) {
        state.cartItems[index].quantity = quantity;
      }
    },
    removeFromCart(state, action) {
      const idNeedToRemove = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.id !== idNeedToRemove);
    },
  },
});

const { actions, reducer } = cartSlice;
export const {
  showMiniCart,
  hideMiniCart,
  addToCart,
  setQuantity,
  removeFromCart,
} = actions;
export default reducer; //default export
