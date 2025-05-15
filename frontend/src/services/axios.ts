import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173', // This is for demonstration; the server must set this header.
  },
  withCredentials: true, // Include credentials if needed
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add the Bearer token to the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;