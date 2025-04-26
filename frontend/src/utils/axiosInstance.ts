import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (
      token &&
      !config.url?.includes("/auth/register") &&
      !config.url?.includes("/auth/login")
    ) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;