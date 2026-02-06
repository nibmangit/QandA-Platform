import apiPrivate from "./axiosPrivate";

export const getAnswersByQuestionId = async (questionId) => {
  try {
    const response = await apiPrivate.get(`questions/answers/`, { params: { question: questionId } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching answers for question id ${questionId}:`, error);
    throw error;
  }
};
