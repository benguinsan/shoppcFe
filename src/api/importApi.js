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
    let url = `${DETAIL_API_URL}`;
    const params = { ma_phieu_nhap: maPN };
    const query = buildQuery(params);
    if (query) url += `?${query}`;
    return axiosClient.get(url);
  },
  getStatistics: (params = {}) => {
    let url = `${API_URL}/getStatistics`;
    const query = buildQuery(params);
    if (query) url += `?${query}`;
    return axiosClient.get(url);
  },
  createImport: (data) => {
    return axiosClient.post(`${API_URL}`, data);
  },
  createImportDetail: (data) => {
    return axiosClient.post(`/shoppc/api/chitietphieunhap/create/`, data);
  },
  createSeri: (data) => {
    return axiosClient.post("/shoppc/api/seri/create", data);
  }
};

export default importApi;