import axiosClient from "./axiosClient";

const orderApi = {
  // Lấy danh sách đơn hàng
  getOrders(page = 1) {
    const url = `/hoadon?page=${page}`;
    return axiosClient.get(url);
  },

  // Tìm kiếm đơn hàng
  searchOrders(search, page = 1) {
    const url = `/hoadon/search?search=${encodeURIComponent(search)}&page=${page}`;
    return axiosClient.get(url);
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails(orderId) {
    const url = `/hoadon/${orderId}/chitiet`;
    return axiosClient.get(url);
  },

  // Cập nhật đơn hàng
  updateOrder(orderId, data) {
    const url = `/hoadon/${orderId}`;
    return axiosClient.put(url, data);
  },

  // Cập nhật chi tiết đơn hàng
  updateOrderDetail(detailId, data) {
    const url = `/chitiethoadon/${detailId}`;
    return axiosClient.put(url, data);
  },

  createOrder(data) {
    const url = "/v1/orders";
    return axiosClient.post(url, data);
  },
  cancelOrder(id, data) {
    const url = `/v1/orders/${id}`;
    return axiosClient.patch(url, data);
  },
  getOrder(id, query) {
    const url = `/v1/orders?user=${id}&${query}`;
    return axiosClient.get(url);
  },
  getOrderId(id) {
    const url = `/v1/orders/${id}`;
    return axiosClient.get(url);
  },
};
export default orderApi;
