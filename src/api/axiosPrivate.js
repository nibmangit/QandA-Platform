import axios from "axios";

const apiPrivate = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR (You already have this)
apiPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiPrivate.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we are trying a refresh

      try {
        const refreshToken = localStorage.getItem("refreshToken");
         
        const response = await axios.post("http://127.0.0.1:8000/api/user/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
 
        localStorage.setItem("accessToken", newAccessToken);

        // Update the header of the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return apiPrivate(originalRequest);
      } catch (refreshError) { 
        console.error("Refresh token expired. Logging out.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiPrivate;