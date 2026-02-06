import { useState, useEffect } from "react";
import apiPrivate from "../api/axiosPrivate"; // Import for direct toggle calls
import { 
  getQuestionById, postAnswer, updateAnswer, 
  deleteAnswerApi, postComment, getQuestions 
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
      setRelatedQuestions(related.results?.filter(q => q.id !== parseInt(id)).slice(0, 3) || []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadData(); }, [id]);

  // --- Like/Dislike Logic ---
  const handleToggleLike = async (type, targetId) => {
    try {
      const url = `/questions/${type}s/${targetId}/like-toggle/`;
      const response = await apiPrivate.post(url);
      const { likes, dislikes } = response.data;

      if (type === "question") {
        setQuestion(prev => ({ ...prev, likes, dislikes }));
      } else {
        setAnswers(prev => prev.map(a => a.id === targetId ? { ...a, likes, dislikes } : a));
      }
    } catch (err) {
      console.error("Toggle failed", err);
    }
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
    const resp = await postComment(answerId, { body: text });
    setAnswers(prev => prev.map(a => 
      a.id === answerId ? { ...a, comments: [...(a.comments || []), resp] } : a
    ));
    setCommentInputs(prev => ({ ...prev, [answerId]: "" }));
  };

  return {
    question, answers, relatedQuestions, loading,
    commentInputs, setCommentInputs, openCommentsFor, setOpenCommentsFor,
    handlePostAnswer, handleUpdateAnswer, handleDeleteAnswer, handlePostComment, handleToggleLike
  };
};