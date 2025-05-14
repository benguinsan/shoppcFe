import axiosClient from './axiosClient';

const warrantyApi = {
  // Lấy danh sách bảo hành có phân trang và tìm kiếm
  getWarranties: async (page = 1, limit = 10, search = '') => {
    let url = `/api/baohanh?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${search}`;
    }
    return axiosClient.get(url);
  },
  
  // Lấy chi tiết một bảo hành
  getWarrantyById: async (warrantyId) => {
    return axiosClient.get(`/api/baohanh/${warrantyId}`);
  },
  
  // Cập nhật trạng thái bảo hành
  updateWarrantyStatus: async (warrantyId, data) => {
    return axiosClient.put(`/api/baohanh/${warrantyId}/status`, data);
  },
  
  // Tạo bảo hành mới
  createWarranty: async (warrantyData) => {
    return axiosClient.post('/api/baohanh', warrantyData);
  },
  
  // Lấy chi tiết hóa đơn để tạo bảo hành
  getOrderDetails: async (orderId) => {
    return axiosClient.get(`/api/hoadon/${orderId}/chitiet`);
  }
};

export default warrantyApi;
