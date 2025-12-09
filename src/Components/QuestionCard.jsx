import { useState } from "react";
import {ThumbsUp,ThumbsDown,MessageSquare,Edit,Trash2, Bookmark, } from "lucide-react";
import {findUser, findCategory, formatScore, getTagsForQuestion, } from "../utils/Find";
import { BDU, BDU_DARK } from "../utils/css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "./DeleteModal";

const QuestionCard = ({ question, onDelete, showImage = false, showFullBody = false }) => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(question.is_bookmarked);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const author = findUser(question.authorId);
  const category = findCategory(question.categoryId);
  const questionTagObjects = getTagsForQuestion(question);

  const isOwner = currentUser?.id === author.id;

  const handleDelete = () => {
    onDelete(question.id);
    setIsModalOpen(false);
  };

  const handleBookmark = () => {
    if (!isLoggedIn) return navigate("/auth");
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    if (!isLoggedIn) return navigate("/auth");
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    if (!isLoggedIn) return navigate("/auth");
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <>
      <div className={`bg-white dark:bg-[#1A2A3A] dark:text-[${BDU_DARK.TEXT}] p-5 rounded-xl shadow-md transition-shadow hover:shadow-lg border border-gray-100 dark:border-[#1E293B]`}>
         
        <div className="flex justify-between items-start">
          <h3
            className={`text-lg font-bold cursor-pointer hover:text-[${BDU.ACCENT}] transition-colors dark:text-[${BDU.TEXT}]`}
            onClick={()=> navigate(`/questions/${question.id}`)}
          >
            {question.title}
            <p className={`font-semibold text-blue-600 dark:text-[${BDU_DARK.ACCENT}]`}>@ {category.name}</p>
          </h3>

          <div className="flex space-x-2">
            <button
              className="flex items-center text-sm text-yellow-500 hover:text-yellow-600 hover:cursor-pointer"
              onClick={handleBookmark}
              title="Bookmark"
            >
              <Bookmark fill={isBookmarked ? "#FDB813" : ""} size={16} className="mr-1" />
            </button>
            {isOwner && (
              <>
                <button
                  className="flex items-center text-sm text-yellow-500 hover:text-yellow-600 hover:cursor-pointer"
                  onClick={() => navigate(`/edit-question/${question.id}`)}
                  title="Edit"
                >
                  <Edit size={16} className="mr-1" />
                </button>
                <button
                  className="flex items-center text-sm text-red-500 hover:text-red-600 hover:cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                  title="Delete"
                >
                  <Trash2 size={16} className="mr-1" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <p className={`text-sm mt-2 mb-3 line-clamp-${showFullBody ? "none" : "2"} text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`}>
          {showFullBody ? question.body : question.body.substring(0, 150) + "..."}
        </p>

        {/* Image */}
        {showImage && question.image && (
          <img
            src={`/${question.image}`}
            alt="Question Diagram"
            className="w-full max-h-80 object-cover rounded-xl my-4 border border-gray-200 dark:border-gray-700"
          />
        )}

        {/* Tags */}
        <span className="flex flex-wrap m-4">
          {questionTagObjects?.map(tag => (
            <span key={`${tag.id}-${tag.name}`} className="text-xs bg-blue-300 m-2 rounded-full py-1 px-3 dark:text-[#0F172A]">
              #{tag.name}
            </span>
          ))}
        </span>

        {/* Stats + Author */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
          {/* Left */}
          <div className="flex flex-wrap sm:flex-row items-center space-x-3">
            <div className="flex items-center space-x-1 hover:cursor-pointer">
              <ThumbsUp size={16} onClick={handleLike} fill={isLiked ? "#33BF24" : "none"} className="text-green-500" />
              <span>{formatScore(question.likes)}</span>
            </div>
            <div className="flex items-center space-x-1 hover:cursor-pointer">
              <ThumbsDown onClick={handleDislike} fill={isDisliked ? "#F00" : "none"} size={16} className="text-red-500" />
              <span>{formatScore(question.dislikes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare size={16} className={`text-[${BDU.ACCENT}]`} />
              <span className="font-semibold">{question.answers} Answers</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center mt-2 sm:mt-0 justify-end w-full sm:w-auto">
            <img src={author.avatar} alt={author.name} className="h-6 w-6 rounded-full mr-2 object-cover hover:cursor-pointer" />
            <span className="hover:cursor-pointer hover:underline" onClick={() => navigate(`/profile/${author.id}`)}>{author.name}</span>
            <span className="ml-3 text-xs">{new Date(question.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />
    </>
  );
};

export default QuestionCard;
