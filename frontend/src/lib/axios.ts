import axios from "axios";

// For development: your server runs on localhost:5000
// For production: your frontend and backend are served from the same domain
// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://url-shortener-fbzr.onrender.com";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
});

