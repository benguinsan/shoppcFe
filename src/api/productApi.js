import axiosClient from "./axiosClient";

const productApi = {
  getAllProduct() {
    const url = "/api/v1/products";
    return axiosClient.get(url);
  },
};
export default productApi;
