import axios from "axios";

const brandApi = {
  getBrandById: async (brandId) => {
    try {
      const response = await axios.get(
        `http://localhost/shoppc/api/loaisanpham/${brandId}/get`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      throw error;
    }
  },
};

export default brandApi;
