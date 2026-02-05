import axios from "axios";

const apiPrivate = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("Retrieved token from localStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added Authorization header to request", config.headers.Authorization);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiPrivate;
