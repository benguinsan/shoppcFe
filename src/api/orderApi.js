import axiosClient from "./axiosClient";

const orderApi = {
  createOrder(data) {
    const url = "/api/v1/orders";
    return axiosClient.post(url, data);
  },
  getOrder(id) {
    const url = `/api/v1/orders?user=${id}`;
    // const url ="{{url}}/api/v1/orders?user=6370aec572a828e327a1b818&status=Processed";
    return axiosClient.get(url);
  },
};
export default orderApi;
