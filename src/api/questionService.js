import apiPrivate from "./axiosPrivate";
import apiPublic from "./axiosPublic";

export const getCategories = async () => {
  try {
    const response = await apiPublic.get("/questions/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoriesById = async (id) => {
  try {
    const response = await apiPublic.get(`/questions/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}

export const getQuestions = async (params = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const api = token ? apiPrivate : apiPublic;
    const response = await api.get("/questions/questions/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const getQuestionById = async (id) => {
  try {
    const response = await apiPrivate.get(`/questions/questions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching question with id ${id}:`, error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const response = await apiPublic.get("/questions/tags/");
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

export const createQuestion = async (formData)=>{
  try{
    const response = await apiPrivate.post('questions/questions/',formData, {   
      headers: {
      'Content-Type': 'multipart/form-data',
    },
    });
    return response.data;
  }catch(error){
    console.error("Error creating question:", error);
    throw error;
  }
}

export const updateQuestion = async (id, formData) => {
  try {
    const response = await apiPrivate.patch(`/questions/questions/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating question with id ${id}:`, error);
    throw error;
  }
};

export const deleteQuestion = async (id)=>{
  try{
    await apiPrivate.delete(`/questions/questions/${id}/`); 
  }catch{
    console.error("error during delating the questio with id: ", id);
  }
} 