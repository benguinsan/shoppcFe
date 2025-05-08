import { data } from "autoprefixer";
import axiosClient from "./axiosClient";

const userApi = {
  register(data) {
    const url = "/api/auth/register";
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "/api/auth/login";
    return axiosClient.post(url, data);
  },
  // loginWithGoogle(data) {
  //   const url = "/api/v1/users/userLoginWith";
  //   return axiosClient.post(url, data);
  // },
  // verify(data) {
  //   const url = "/api/v1/users/verify";
  //   return axiosClient.post(url, data);
  // },
  // forgotPassword(data) {
  //   const url = "/api/v1/users/forgotPassword";
  //   return axiosClient.post(url, data);
  // },
  // changeState(data) {
  //   const url = "/api/v1/users/changeState";
  //   return axiosClient.patch(url, data);
  // },
  logout() {
    const url = "/api/auth/logout";
    return axiosClient.get(url);
  },
  // verifyResetPassword(data) {
  //   const url = "/api/v1/users/verifyResetPass";
  //   return axiosClient.post(url, data);
  // },
  getUser() {
    const url = "/api/user/profile";
    return axiosClient.get(url);
  },
  updateUser(data) {
    const url = "/api/user/profile";
    return axiosClient.patch(url, data);
  },
  resetPassword(data, token) {
    const url = `/api/v1/users/resetPassword/${token}`;
    return axiosClient.patch(url, data);
  },
  addAddress(data) {
    const url = "/api/v1/users/createAddress";
    return axiosClient.patch(url, data);
  },
  getAddress() {
    const url = "/api/v1/users/me/address";
    return axiosClient.get(url);
  },
  deleteAddress(data) {
    const url = "/api/v1/users/deleteAddress";
    return axiosClient.patch(url, data);
  },
  updateAddress(data) {
    const url = "/api/v1/users/updateAddress";
    return axiosClient.patch(url, data);
  },
  updatePassword(data) {
    const url = "/api/user/password";
    return axiosClient.patch(url, data);
  },
  updateDefault(data) {
    const url = "/api/v1/users/setDefaultAddress";
    return axiosClient.patch(url, data);
  },
  
};
export default userApi;
