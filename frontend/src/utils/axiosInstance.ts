import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`Adding auth token to request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log(`API Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error(`API Error from ${error.config?.url}:`, {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;
