import apiPrivate from "./axiosPrivate";
import apiPublic from "./axiosPublic";

export const getTopUsers = async () => {
  const response = await apiPublic.get('/user/top-users/');
  return response.data;
}

export const updateProfile = async (formData) => {
  const response = await apiPrivate.patch('/user/profile/update/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const findUserById = async (userId) => {
  const response = await apiPublic.get(`/user/users/${userId}/`);
  return response.data;
}

// api/userServiece.js
export const findUserByEmail = async (email) => {
  try { 
    const response = await apiPublic.get('/user/users/', { params: { email } });
    
    const results = Array.isArray(response.data) ? response.data : response.data.results;

    if (results && results.length > 0) { 
      return results[0]; 
    }
    return null;
  } catch (error) {
    console.error('User lookup failed', error);
    return null;
  }
};

