import axiosClient from "./axiosClient";

const warrantyApi = {
  // Lấy danh sách bảo hành
  getWarranties(page = 1) {
    const url = `/api/baohanh?page=${page}`;
    return axiosClient.get(url);
  },

  // Tìm kiếm bảo hành
  searchWarranties(search, page = 1) {
    const url = `/api/baohanh/search?search=${encodeURIComponent(search)}&page=${page}`;
    return axiosClient.get(url);
  },

  // Lấy chi tiết bảo hành
  getWarrantyDetails(maBH) {
    const url = `/api/baohanh/${maBH}/chitiet`;
    return axiosClient.get(url);
  },

  // Cập nhật bảo hành
  updateWarranty(maBH, data) {
    const url = `/api/baohanh/${maBH}`;
    return axiosClient.put(url, data);
  },

  // Cập nhật chi tiết bảo hành
  updateWarrantyDetail(maCTBH, data) {
    const url = `/api/chitietbaohanh/${maCTBH}`;
    return axiosClient.put(url, data);
  },
};

export default warrantyApi; 