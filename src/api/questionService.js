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
    const response = await apiPrivate.get("/questions/questions/", { params });
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
 

export const postAnswer = async (data) => {
  const response = await apiPrivate.post('/questions/answers/', data);
  return response.data;
};

export const updateAnswer = async (id, data) => {
  const response = await apiPrivate.patch(`/questions/answers/${id}/`, data);
  return response.data;
};

export const deleteAnswerApi = async (id) => {
  await apiPrivate.delete(`/questions/answers/${id}/`);
};

export const postComment = async (answerId, data) => {
    // Matches path("answers/<int:answer_id>/comments/", ...)
    const response = await apiPrivate.post(`/questions/answers/${answerId}/comments/`, data);
    return response.data;
};