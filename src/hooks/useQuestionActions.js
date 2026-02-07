import { useState } from "react";
import apiPrivate from "../api/axiosPrivate";
import { deleteQuestion } from "../api/questionService";

export const useQuestionActions = (initialQuestions = []) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const onLikeList = async (type, id, isLike) => {
    try {
      const resp = await apiPrivate.post(`/questions/questions/${id}/like-toggle/`, { 
        is_like: isLike 
      });
      setQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, ...resp.data } : q
      ));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const onBookmarkList = async (id, removeOnUnbookmark = false) => {
    try {
      await apiPrivate.post(`/questions/questions/${id}/bookmark/`);
      if (removeOnUnbookmark) {
        // Specifically for the Bookmarks page
        setQuestions(prev => prev.filter(q => q.id !== id));
      } else {
        // Specifically for the Home/All questions page
        setQuestions(prev => prev.map(q => 
          q.id === id ? { ...q, is_bookmarked: !q.is_bookmarked } : q
        ));
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  const onDeleteList = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    questions,
    setQuestions,
    onLikeList,
    onBookmarkList,
    onDeleteList
  };
};