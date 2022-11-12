import axiosClient from "./axiosClient";

const reviewApi = {
  postReview(data) {
    const url = "/api/v1/reviews";
    return axiosClient.post(url, data);
  },
  getReview(id) {
    const url = `/api/v1/products/${id}/reviews`;
    return axiosClient.get(url);
  },
  updateReview(data, id) {
    const url = `/api/v1/reviews/${id}`;
    return axiosClient.patch(url, data);
  },
};
export default reviewApi;
