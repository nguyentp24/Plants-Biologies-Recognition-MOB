// config/axios.jsx
import axios from "axios";

// Base URL cho Auth / Profile / Users API
const baseUrl = "https://biologieseducationapp.onrender.com/api";

// Base URL cho AI nhận diện hình ảnh (đã có /api)
// const aiUrl = "https://bilogieseducationapp.onrender.com/api/Predict/upload";

// Middleware gắn token nếu có
const handleBefore = (config) => {
  try {
    const token = localStorage?.getItem("token")?.replaceAll('"', "");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Token not found or localStorage error:", err);
  }
  return config;
};

// API chính cho user/profile
const api = axios.create({
  baseURL: baseUrl,
});
api.interceptors.request.use(handleBefore, null);
