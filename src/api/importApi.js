import axiosClient from "./axiosClient";

function buildQuery(params = {}) {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}

const API_URL = "/api/phieunhap";
const DETAIL_API_URL = "/api/chitietphieunhap";

const importApi = {
  getImports: (params = {}) => {
    let url = `${API_URL}`;
    const query = buildQuery(params);
    if (query) url += `?${query}`;
    return axiosClient.get(url);
  },
  getImportDetails: (maPN) => {
    return axiosClient.get(`${DETAIL_API_URL}/${maPN}`);
  },
  createImport: (data) => {
    return axiosClient.post(`${API_URL}`, data);
  },
  createImportDetail: (data) => {
    return axiosClient.post(`/shoppc/api/chitietphieunhap/create/`, data);
  },
  createSeri: (data) => {
    return axiosClient.post("/api/seri/create", data);
  },
  updateImport: (id, data) => {
    return axiosClient.put(`${API_URL}/update/${id}`, data);
  },
  updateImportDetail: (id, data) => {
    return axiosClient.put(`${DETAIL_API_URL}/update/${id}`, data);
  },
  updateImportTotalAmount: (id) => {
    return axiosClient.put(`${API_URL}/${id}/updateTongTien`, {});
  }
};

export default importApi;