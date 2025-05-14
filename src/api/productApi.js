import axiosClient from "./axiosClient";
import axios from "axios";

const productApi = {
  // getAllProduct(query) {
  //   const url = `/api/v1/products?${query}`;
  //   return axiosClient.get(url);
  // },
  getSanPhamById(id) {
    const url = `/api/sanpham/${id}`;
    return axiosClient.get(url);
  },
  getSanPhamFilter: async (filters = {}) => {
    try {
      const params = {};
      const {
        TenSP,
        page = 0,
        limit = 8,
        MaLoaiSP,
        RAM,
        min_price,
        max_price,
        ...rest
      } = filters;

      // Add base pagination params
      params.page = page;
      params.limit = limit;

      // Log chi tiết các tham số nhận được
      console.log("productApi.getSanPhamFilter - Các tham số nhận được:", {
        TenSP,
        MaLoaiSP,
        RAM,
        min_price,
        max_price,
        page,
        limit,
      });

      if (TenSP !== undefined && TenSP !== null) params.TenSP = TenSP;

      // Xử lý tham số MaLoaiSP - giữ nguyên giá trị chuỗi với dấu phẩy
      if (MaLoaiSP !== undefined && MaLoaiSP !== null) {
        // Không cần chuyển đổi, gửi đúng định dạng là chuỗi các ID phân cách bằng dấu phẩy
        params.MaLoaiSP = MaLoaiSP;
        console.log("Gửi MaLoaiSP với giá trị:", MaLoaiSP);
      }

      if (RAM !== undefined && RAM !== null) params.RAM = RAM;
      if (min_price !== undefined && min_price !== null)
        params.min_price = min_price;
      if (max_price !== undefined && max_price !== null)
        params.max_price = max_price;

      // Add any additional filters
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      // Tạo URL đầy đủ với tham số để kiểm tra
      const urlWithParams = new URLSearchParams(params);
      const fullUrl = `http://localhost/shoppc/api/sanpham/filter?${urlWithParams.toString()}`;
      console.log("URL đầy đủ sẽ gửi đến API:", fullUrl);

      const response = await axios.get(
        "http://localhost/shoppc/api/sanpham/filter",
        { params }
      );

      console.log("Kết quả phản hồi từ API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    }
  },
};
export default productApi;
