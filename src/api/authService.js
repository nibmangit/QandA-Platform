import api from "./axiosPrivate";
import apiPublic from "./axiosPublic";
 
export const loginUser = async (email, password) => {
  try {
    const response = await apiPublic.post("/user/login/", { email, password });
    return response.data; 
  } catch (error) {
    throw error.response?.data || { detail: "Login failed" };
  }
};

// POST /auth/register/
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await apiPublic.post("/user/register/", { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Registration failed" };
  }
};


export const getProfile = async () => {
  const response = await api.get("/user/profile/");
  return response.data;
};
