import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuestionDetails } from "../hooks/useQuestionDetails";
import { BDU } from "../utils/css";
import QuestionCard from "../Components/QuestionCard";
import AnswerItem from "../Components/AnswerItem";
import RelatedSidebar from "../Components/RelatedSidebar";
import DeleteModal from "../Components/DeleteModal";

const QuestionDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const bottomRef = useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState("");

  const {
    question, answers, relatedQuestions, loading,
    commentInputs, setCommentInputs, openCommentsFor, setOpenCommentsFor,
    handlePostAnswer, handleUpdateAnswer, handleDeleteAnswer, handlePostComment
  } = useQuestionDetails(id);

  const onAnswerSubmit = async () => {
    if (!newAnswerText.trim()) return;
    try {
      await handlePostAnswer(newAnswerText);
      setNewAnswerText("");
      // Smooth scroll to new answer
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch {
      alert("Failed to post answer. Please try again.");
    }
  };

  const openDeleteModal = (aid) => {
    setDeleteId(aid);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading your discussion...</p>
    </div>
  );

  if (!question) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-red-500">Question not found</h2>
      <button onClick={() => window.history.back()} className="mt-4 text-blue-600 underline">Go Back</button>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            <QuestionCard 
              question={question} 
              showImage={true} 
              showFullBody={true} 
            />

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b dark:border-gray-800 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
                </h3>
              </div>

              {answers.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-[#1E293B] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500">No answers yet. Be the first to help!</p>
                </div>
              ) : (
                answers.map((answer) => (
                  <AnswerItem 
                    key={answer.id}
                    answer={answer}
                    currentUser={currentUser}
                    isOpen={openCommentsFor === answer.id}
                    onToggleComments={() => setOpenCommentsFor(openCommentsFor === answer.id ? null : answer.id)}
                    commentInput={commentInputs[answer.id]}
                    onCommentInputChange={(val) => setCommentInputs({...commentInputs, [answer.id]: val})}
                    onPostComment={handlePostComment}
                    onUpdate={handleUpdateAnswer}
                    onDelete={openDeleteModal}
                  />
                ))
              )}
            </div>

            {/* Post Answer Section */}
            <div ref={bottomRef} className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Your Answer</h3>
              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl dark:bg-[#0F172A] dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                rows="6"
                placeholder="Share your knowledge and provide a detailed answer..."
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={onAnswerSubmit}
                  disabled={!newAnswerText.trim()}
                  className="px-8 py-3 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ backgroundColor: BDU.ACCENT }}
                >
                  Post Your Answer
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedSidebar questions={relatedQuestions} />
          </div>
        </div>
      </div>

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={() => {
          handleDeleteAnswer(deleteId);
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
};

export default QuestionDetailsPage;