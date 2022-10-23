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
};
export default userApi;
