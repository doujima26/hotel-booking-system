import axios from "axios";

//mọi request sẽ được gửi đến http://
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default api;