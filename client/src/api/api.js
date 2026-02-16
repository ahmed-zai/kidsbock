// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: '/api', // Nginx will proxy requests from /api to backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
