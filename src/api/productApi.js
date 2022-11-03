import axiosClient from "./axiosClient";

const productApi = {
  getAllProduct() {
    const url = "/api/v1/products";
    return axiosClient.get(url);
  },
  getProductId() {
    const url = "/api/v1/products/:id";
    return axiosClient.get(url);
  },
};
export default productApi;
