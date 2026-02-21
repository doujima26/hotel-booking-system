import axios from "axios";

//mọi request sẽ được gửi đến http://
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Thêm interceptor để tự động thêm token vào header của mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;