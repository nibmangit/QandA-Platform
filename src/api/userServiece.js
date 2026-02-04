import api from "./axios";

export const getTopUsers = async () => {
  const response = await api.get('/user/top-users/');
  return response.data;
}

export const updateProfile = async (formData) => {
  const response = await api.patch('/user/profile/update/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
