import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {
    "Content-Type": "application/JSON",
  },
});
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { config, status, data } = error.response;
    const URLs = ["/api/v1/users/signup", "/api/v1/users/login"];
    if (
      (URLs.includes(config.url) && status === 500) ||
      status == 400 ||
      status == 401
    ) {
      throw new Error(data.message);
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
