import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash2, Bookmark } from "lucide-react";
import { formatScore } from "../utils/Find"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "./DeleteModal"; 
import { getCategoriesById, getTags } from "../api/questionService";
import AuthorDisplay from "./AuthorDisplay";
import ActionButton from "../helper/ActionButton";

const QuestionCard = ({ question, onDelete, onLike, onBookmark, showImage = false, showFullBody = false }) => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, openLogin } = useAuth();
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

  const protectedAction = (action) => {
    if (!isLoggedIn) { 
      openLogin();
    } else {
      action();
    }
  };

  return (
    <>
      <div className={`bg-white dark:bg-[#1A2A3A] p-5 rounded-xl shadow-md border border-gray-100 dark:border-[#1E293B] transition-shadow hover:shadow-lg`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`text-lg font-bold cursor-pointer hover:text-blue-500 transition-colors dark:text-white wrap-break-word`}
                onClick={() => protectedAction(() => navigate(`/questions/${question.id}`))}>
              {question.title}
            </h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase">@ {category?.name || "General"}</p>
          </div>
 
          <div className="hidden sm:flex space-x-2">
            <ActionButton icon={Bookmark} active={question.is_bookmarked} 
              activeColor="text-yellow-500" onClick={() => protectedAction(() => onBookmark())} 
              label={question.is_bookmarked ? "Saved" : "Save"} />
            {isOwner && (
              <>
                <button onClick={() => navigate(`/edit-question/${question.id}`)} className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"><Edit size={18} /></button>
                <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"><Trash2 size={18} /></button>
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
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center space-x-4">
              <ActionButton icon={ThumbsUp} label={formatScore(question.likes)} active={question.is_liked} 
                activeColor="text-blue-500" onClick={() => protectedAction(() => onLike("question", question.id, true))} />

              <ActionButton icon={ThumbsDown} label={formatScore(question.dislikes)} active={question.is_disliked} 
                activeColor="text-red-500" onClick={() => protectedAction(() => onLike("question", question.id, false))} />
            </div>

            {/* --- MOBILE VIEW BUTTONS --- */}
            {/* flex on mobile, hidden on small screens and up (640px+) */}
            <div className="flex sm:hidden items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-2">
              <ActionButton icon={Bookmark} active={question.is_bookmarked} 
                activeColor="text-yellow-500" onClick={() => protectedAction(() => onBookmark())} 
                label={question.is_bookmarked ? "Saved" : "Save"} />
              {isOwner && (
                <>
                  <button onClick={() => navigate(`/edit-question/${question.id}`)} className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"><Edit size={18} /></button>
                  <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"><Trash2 size={18} /></button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <MessageSquare size={18} className="text-blue-500" />
              <span className="text-sm font-bold dark:text-gray-400">{question.answers_count} <span className="hidden xs:inline">Answers</span></span>
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