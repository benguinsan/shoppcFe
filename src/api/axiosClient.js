import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://localhost/shoppc/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const { config, status, data } = error.response;
    if (status === 500 || status === 400 || status === 401 || status === 404 || status === 403) {
      throw new Error(data.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
