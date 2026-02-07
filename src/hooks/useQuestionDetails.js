import { useState, useEffect } from "react";
import apiPrivate from "../api/axiosPrivate"; 
import { 
  getQuestionById, postAnswer, updateAnswer, 
  deleteAnswerApi, postComment, getQuestions, 
  deleteQuestion
} from "../api/questionService";

export const useQuestionDetails = (id) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getQuestionById(id);
      setQuestion(data);
      setAnswers(data.answers || []);
      
      const related = await getQuestions({ category: data.category });
      // Safety check for paginated related questions
      const relatedList = related?.results || (Array.isArray(related) ? related : []);
      setRelatedQuestions(relatedList.filter(q => q.id !== parseInt(id)).slice(0, 3));
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadData(); }, [id]);

  const handleToggleLike = async (type, targetId, isLike) => {
    try {
      const endpoint = type === "question" ? `/questions/questions/${targetId}/like-toggle/` : `/questions/answers/${targetId}/like-toggle/`;
      const response = await apiPrivate.post(endpoint, { is_like: isLike }); 
      if (type === "question") {
        setQuestion(prev => ({ ...prev, ...response.data }));
      } else {
        setAnswers(prev => prev.map(a => 
          a.id === targetId ? { ...a, ...response.data } : a
        ));
      }
    } catch (err) { console.error("Like toggle failed", err); }
  };

  const handleToggleBookmark = async (questionId) => {
    try {
      await apiPrivate.post(`/questions/questions/${questionId}/bookmark/`);
      setQuestion(prev => ({ ...prev, is_bookmarked: !prev.is_bookmarked }));
    } catch (err) { console.error("Bookmark toggle failed", err); }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      window.location.href = "/";
    } catch (err) { console.error("Failed to delete", err); } 
  };

  const handlePostAnswer = async (text) => {
    const resp = await postAnswer({ question: id, body: text });
    setAnswers(prev => [resp, ...prev]);
    return resp;
  };

  const handleUpdateAnswer = async (answerId, text) => {
    const updated = await updateAnswer(answerId, { body: text });
    setAnswers(prev => prev.map(a => a.id === answerId ? updated : a));
  };

  const handleDeleteAnswer = async (answerId) => {
    await deleteAnswerApi(answerId);
    setAnswers(prev => prev.filter(a => a.id !== answerId));
  };

  const handlePostComment = async (answerId) => {
    const text = (commentInputs[answerId] || "").trim();
    if (!text) return;
    try {
      const resp = await postComment(answerId, { body: text });
      
      setAnswers(prev => prev.map(a => {
        if (a.id === answerId) {
          // Logic to handle both paginated and non-paginated comments
          const currentComments = a.comments?.results || (Array.isArray(a.comments) ? a.comments : []);
          const updatedList = [...currentComments, resp];
          
          // Keep structure consistent: if it was paginated, stay paginated
          const newCommentsValue = a.comments?.results 
            ? { ...a.comments, results: updatedList } 
            : updatedList;

          return { ...a, comments: newCommentsValue };
        }
        return a;
      }));
      setCommentInputs(prev => ({ ...prev, [answerId]: "" }));
    } catch (err) { console.error("Comment post failed", err); }
  };

  return {
    question, answers, setAnswers, // Added setAnswers here
    relatedQuestions, loading,
    commentInputs, setCommentInputs, openCommentsFor, setOpenCommentsFor,
    handlePostAnswer, handleUpdateAnswer, handleDeleteAnswer, handlePostComment,
    handleToggleLike, handleToggleBookmark, handleDeleteQuestion
  };
};