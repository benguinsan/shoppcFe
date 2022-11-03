import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { create } from "yup/lib/boolean";

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null },
  reducers: {
    getCart(state, action) {
      state.cart = JSON.parse(localStorage.getItem("cart"));
    },
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
        if (cart[index].quantity < newItem.data.inventory) {
          cart[index].quantity += newItem.quantity;
          toast.success("Đã thêm sản phẩm vào giỏ hàng");
        } else {
          toast.warning("Chỉ còn 1 sản phẩm");
        }
      } else {
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
        cart.push(newItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
    setQuantity(state, action) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const { id, quantity } = action.payload;
      console.log(id, quantity);
      const index = cart.findIndex((x) => x.id === id);
      if (index >= 0) {
        cart[index].quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
    removeFromCart(state, action) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const idNeedToRemove = action.payload;
      cart = cart.filter((x) => x.id !== idNeedToRemove);
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
  },
});

const { actions, reducer } = cartSlice;
export const { addToCart, setQuantity, removeFromCart, getCart } = actions;
export default reducer; //default export
