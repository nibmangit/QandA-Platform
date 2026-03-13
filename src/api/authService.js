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
 
export const googleLoginApi = async (googleToken) => {
  try {
    // We send the token in an object { token: "..." } 
    // because that is what our Django View expects: token = request.data.get('token')
    const response = await apiPublic.post("/user/google-login/", { 
      token: googleToken 
    });
    
    return response.data; // This returns { access, refresh, user }
  } catch (error) {
    console.error("API Error during Google Login:", error);
    throw error.response?.data || { detail: "Google login failed" };
  }
};

