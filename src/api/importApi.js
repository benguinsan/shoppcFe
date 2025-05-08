import axiosClient from "./axiosClient";

const importApi = {
  getImports: (page = 1, search = "") => {
    let url = `/phieunhap?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return axiosClient.get(url);
  },
  getImportDetails: (maPN) => {
    return axiosClient.get(`/phieunhap/${maPN}`);
  },
};

export default importApi; 