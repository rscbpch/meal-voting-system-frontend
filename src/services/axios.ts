import axios from "axios";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api";

const API = axios.create({
    baseURL: BACKEND_URL
})

// always attach the token
API.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem("token");
        console.log("Axios interceptor - Token from localStorage:", authToken ? "present" : "missing");
        if(authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
            console.log("Authorization header set:", config.headers.Authorization);
        } else {
            console.log("No token found, request will be made without authorization");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// handle the expire tokens
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem("token");

            const userRole = localStorage.getItem("userRole");
            if (userRole === "voter") window.location.href = "/sign-in";
            else if (userRole === "staff") window.location.href = "/staff-login"

            localStorage.removeItem("userRole")
        }
        return Promise.reject(error);
    }
);

export default API;