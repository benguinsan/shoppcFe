import axiosClient from "./axiosClient";

const orderApi = {
  // Lấy danh sách đơn hàng
  getOrders(page = 1) {
    const url = `/api/hoadon?page=${page}`;
    return axiosClient.get(url);
  },

  // Tìm kiếm đơn hàng
  searchOrders(search, page = 1, fromDate = null, toDate = null) {
    // Xây dựng URL cơ bản
    let url = `/api/hoadon/search?=${encodeURIComponent(search)}&page=${page}`;
    
    // Thêm tham số từ ngày và đến ngày nếu có
    if (fromDate) {
      url += `&from_date=${fromDate}`;
    }
    if (toDate) {
      url += `&to_date=${toDate}`;
    }
    
    console.log("URL tìm kiếm:", url);
    return axiosClient.get(url);
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails(orderId) {
    const url = `/api/hoadon/${orderId}/chitiet`;
    return axiosClient.get(url);
  },

  // Cập nhật đơn hàng
  updateOrder(orderId, data) {
    const url = `/api/hoadon/${orderId}`;
    return axiosClient.put(url, data);
  },

  // Cập nhật chi tiết đơn hàng
  updateOrderDetail(detailId, data) {
    const url = `/api/chitiethoadon/${detailId}`;
    return axiosClient.put(url, data);
  },

  createOrder(data) {
    const url = "/api/v1/orders";
    return axiosClient.post(url, data);
  },
  cancelOrder(id, data) {
    const url = `/api/v1/orders/${id}`;
    return axiosClient.patch(url, data);
  },
  getOrder(id, query) {
    const url = `/api/v1/orders?user=${id}&${query}`;
    return axiosClient.get(url);
  },
  getOrderId(id) {
    const url = `/api/v1/orders/${id}`;
    return axiosClient.get(url);
  },
};
export default orderApi;
