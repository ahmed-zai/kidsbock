// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: '/api', // Nginx will proxy requests from /api to backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Axios Interceptor: Checking for token. Found:", !!token);
    if (token) {
      console.log("Axios Interceptor: Token present. Attaching to request for:", config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("Axios Interceptor: No token found for request to:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
