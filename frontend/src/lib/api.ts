import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8081', // Your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});