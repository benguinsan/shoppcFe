import axiosClient from "./axiosClient";

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
        page = 0,
        limit = 20,
        MaLSP,
        RAM,
        min_price,
        max_price,
        ...rest
      } = filters;

      // Add base pagination params
      params.page = page;
      params.limit = limit;

      // Add optional filter params
      if (MaLSP !== undefined && MaLSP !== null) params.MaLSP = MaLSP;
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

      const response = await axios.get(
        "http://localhost/shoppc/api/sanpham/filter",
        { params }
      );

      return response.data;
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    }
  },
};
export default productApi;
