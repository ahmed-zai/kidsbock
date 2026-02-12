// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
