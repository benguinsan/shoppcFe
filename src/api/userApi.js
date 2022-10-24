import { data } from "autoprefixer";
import axiosClient from "./axiosClient";

const userApi = {
  register(data) {
    const url = "/api/v1/users/signup";
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "/api/v1/users/login";
    return axiosClient.post(url, data);
  },
  verify(data) {
    const url = "/api/v1/users/verify";
    return axiosClient.post(url, data);
  },
  forgotPassword(data) {
    const url = "/api/v1/users/forgotPassword";
    return axiosClient.post(url, data);
  },
  changeState(data) {
    const url = "/api/v1/users/changeState";
    return axiosClient.patch(url, data);
  },
  logout() {
    const url = "/api/v1/users/logout";
    return axiosClient.get(url);
  },
  verifyResetPassword(data) {
    const url = "/api/v1/users/verifyResetPass";
    return axiosClient.post(url, data);
  },
  getUser() {
    const url = "/api/v1/users/me";
    return axiosClient.get(url);
  },
  resetPassword(data, token) {
    const url = `/api/v1/users/resetPassword/${token}`;
    console.log(url);
    return axiosClient.patch(url, data);
  },
};
export default userApi;
