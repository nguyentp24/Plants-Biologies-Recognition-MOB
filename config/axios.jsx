import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseUrl = "https://bilogieseducationapp.onrender.com/api/";



export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor bất đồng bộ để lấy token sau khi login
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;