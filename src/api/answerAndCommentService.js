import apiPrivate from "./axiosPrivate";
 
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

export const updateComment = async (commentId, data) => {
  const response = await apiPrivate.patch(`/questions/answers/${commentId}/`, data);
  return response.data;
};