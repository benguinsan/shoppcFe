import axiosClient from "./axiosClient";

const paymentApi = {
  createOrder: (orderData) => {
    return axiosClient.post("/api/hoadon", orderData);
  },
  
  createOrderDetail: (orderDetailData) => {
    return axiosClient.post("/api/chitiethoadon", orderDetailData);
  },
  
  updateOrderTotal: (orderId, totalData) => {
    return axiosClient.put(`/api/hoadon/${orderId}`, totalData);
  },
  
  getOrderById: (orderId) => {
    return axiosClient.get(`/api/hoadon/${orderId}`);
  },
  
  getOrderDetails: (orderId) => {
    return axiosClient.get(`/api/chitiethoadon/${orderId}`);
  }
};

export default paymentApi; 