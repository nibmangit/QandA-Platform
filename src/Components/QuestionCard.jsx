import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash2, Bookmark } from "lucide-react";
import { formatScore } from "../utils/Find"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "./DeleteModal"; 
import { getCategoriesById, getTags } from "../api/questionService";
import AuthorDisplay from "./AuthorDisplay";

const QuestionCard = ({ question, onDelete, onLike, onBookmark, showImage = false, showFullBody = false }) => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(null); 
  const [questionTags, setQuestionTags] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        if (question.category) setCategory(await getCategoriesById(question.category));
        if (question.tags?.length > 0) {
          const allTags = await getTags(); 
          setQuestionTags(allTags.filter(t => question.tags.includes(t.id)));
        }
      } catch (err) { console.error("Metadata fetch error:", err); }
    };
    fetchMeta();
  }, [question.category, question.tags]);  

  const isOwner = isLoggedIn && currentUser?.email === question.author;

  // const handleAction = (actionFn, ...args) => {
  //   if (!isLoggedIn) return navigate("/auth");
  //   if (actionFn) actionFn(...args);
  // };

  return (
    <>
      <div className={`bg-white dark:bg-[#1A2A3A] p-5 rounded-xl shadow-md border border-gray-100 dark:border-[#1E293B] transition-shadow hover:shadow-lg`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`text-lg font-bold cursor-pointer hover:text-blue-500 transition-colors dark:text-white`}
                onClick={() => navigate(`/questions/${question.id}`)}>
              {question.title}
            </h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase">@ {category?.name || "General"}</p>
          </div>

          <div className="flex space-x-2">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    onClick={() => onBookmark()}>
              <Bookmark 
                size={18} 
                fill={question.is_bookmarked ? "#FDB813" : "none"} 
                className={question.is_bookmarked ? "text-yellow-500" : "text-gray-400"} 
              />
            </button>
            {isOwner && (
              <>
                <button onClick={() => navigate(`/edit-question/${question.id}`)} className="text-gray-400 hover:text-yellow-500 p-1"><Edit size={18} /></button>
                <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
              </>
            )}
          </div>
        </div>

        <p className={`text-sm mt-3 mb-3 text-gray-700 dark:text-gray-300 ${!showFullBody && "line-clamp-2"}`}>
          {showFullBody ? question.body : question.body.substring(0, 150) + (question.body.length > 150 ? "..." : "")}
        </p>

        {showImage && question.image && (
          <div className="mt-4 mb-4 rounded-xl overflow-hidden border dark:border-gray-700">
            <img src={question.image.startsWith('http') ? question.image : `${BASE_URL}${question.image}`} 
                 alt="Content" className="w-full max-h-80 object-contain bg-gray-50 dark:bg-gray-900" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 my-4">
          {questionTags.map(tag => (
            <span key={tag.id} className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 py-1 px-3 rounded-full">#{tag.name}</span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t dark:border-gray-800 gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => onLike("question", question.id, true)} className="flex items-center space-x-1 group">
              <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500" />
              <span className="text-sm dark:text-gray-400">{formatScore(question.likes)}</span>
            </button>
            <button onClick={() => onLike("question", question.id, false)} className="flex items-center space-x-1 group">
              <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-500" />
              <span className="text-sm dark:text-gray-400">{formatScore(question.dislikes)}</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageSquare size={18} className="text-blue-500" />
              <span className="text-sm font-bold dark:text-gray-400">{question.answers_count} Answers</span>
            </div>
          </div>
          <AuthorDisplay email={question.author} date={question.created_at} label="Asked" />
        </div>
      </div>
      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={() => { onDelete(question.id); setIsModalOpen(false); }} 
        title="Delete Question"
        message={`Are you sure you want to delete "${question.title}"?`}
      />
    </>
  );
};

export default QuestionCard;