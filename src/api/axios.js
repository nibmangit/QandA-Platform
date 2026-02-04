import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  const publicEndpoints = [
    "/user/register/",
    "/user/login/",
    "/user/top-users/",
  ];
 
  const urlPath = config.url.replace(config.baseURL, "");
  const isPublic = publicEndpoints.some((endpoint) => urlPath.includes(endpoint));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization header added:", config.headers.Authorization);
  }

  return config;
});


export default api;
