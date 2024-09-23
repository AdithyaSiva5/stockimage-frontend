import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_ENV === "prod"
      ? `${process.env.REACT_APP_apiBaseUrl}/api`
      : `${process.env.REACT_APP_apiBaseUrlDev}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
