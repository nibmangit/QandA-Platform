import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuestionDetails } from "../hooks/useQuestionDetails";
import { BDU } from "../utils/css";
import QuestionCard from "../Components/QuestionCard";
import AnswerItem from "../Components/AnswerItem";
import RelatedSidebar from "../Components/RelatedSidebar";
import DeleteModal from "../Components/DeleteModal";
import LoadingPage from "./LoadingPage";
import { FileSearch, HelpCircle, MessageSquare, X, Minimize2 } from "lucide-react";
import EmptyState from "../Components/EmptyState";
import DiscussionRoom from "../Components/Chat/DiscussionRoom";

const QuestionDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth(); 
  const bottomRef = useRef(null);
  const answersStartRef = useRef(null);
  // Dynamic Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    title: "", 
    message: "", 
    onConfirm: () => {} 
  });

  const [newAnswerText, setNewAnswerText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    question, answers, setAnswers, relatedQuestions, loading,
    commentInputs, setCommentInputs, openCommentsFor, setOpenCommentsFor,
    handlePostAnswer, handleUpdateAnswer, handleDeleteAnswer, handlePostComment,
    handleToggleLike, handleToggleBookmark, handleDeleteQuestion
  } = useQuestionDetails(id);    

    useEffect(() => {
    if (isChatOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isChatOpen]);

  const openDeleteQuestionModal = () => {
    setModalConfig({
      title: "Delete Question?",
      message: "Are you sure you want to delete this question? This will remove all associated answers and comments forever.",
      onConfirm: () => handleDeleteQuestion(question.id)
    });
    setIsModalOpen(true);
  };

  const openDeleteAnswerModal = (aid) => {
    setModalConfig({
      title: "Delete Answer?",
      message: "Are you sure you want to delete this answer? This action cannot be undone.",
      onConfirm: () => {
        handleDeleteAnswer(aid);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const onAnswerSubmit = async () => {
    if (!newAnswerText.trim()) return;
    try {
      await handlePostAnswer(newAnswerText);
      setNewAnswerText("");
      setTimeout(() => {
        answersStartRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } catch {
      alert("Failed to post answer. Please try again.");
    }
  };

  const scrollToPostSection = () => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
};

  if (loading) return (<LoadingPage message="Loding question details...." isFullPage={false} />);

  if (!question) return (
    <div className="p-20 text-center">
      <EmptyState
        icon={FileSearch}
        title="Question Not Found"
        message="The question you are looking for might have been deleted or moved. Check the main feed for more."
        buttonLabel="Back to All Questions"
        buttonLink="/questions"
      />
    </div>
  );

return (
    <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen relative">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            <QuestionCard 
              question={question} 
              showImage={true} 
              showFullBody={true}
              onLike={(type, targetId, isLike) => handleToggleLike(type, targetId, isLike)}
              onBookmark={() => handleToggleBookmark(question.id)} 
              onDelete={openDeleteQuestionModal}
            />

            {/* Answers Section */}
            <div className="space-y-6">
              <div ref={answersStartRef} className="flex items-center justify-between border-b dark:border-gray-800 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
                </h3>
                <button 
                  onClick={scrollToPostSection}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all"
                >
                  <MessageSquare size={18} />
                  Write an Answer
                </button>
              </div>

              {answers.length === 0 ? (
                <EmptyState 
                  icon={HelpCircle}
                  title="No Answers Yet"
                  message="This question is still waiting for a hero. Do you have the answer?"
                  buttonLabel="Be the First to Answer"
                  showButton={true}
                  buttonLink="#answer-input" 
                />
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
                    onPostComment={() => handlePostComment(answer.id)}
                    onUpdate={handleUpdateAnswer}
                    onDelete={openDeleteAnswerModal}
                    onLikeToggle={handleToggleLike}
                    setAnswers={setAnswers} 
                  />
                ))
              )}
            </div>

            {/* Post Answer Box */}
            <div ref={bottomRef} className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Your Answer</h3>
              <textarea
                id="answer-input"
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

      {/* --- FLOATING CHAT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Chat Window */}
        {isChatOpen && (
          <div className="
              /* Mobile: Full screen or nearly full screen */
              fixed bottom-0 right-0 w-full h-[100dvh] 
              /* Desktop: Fixed size floating in the corner */
              md:absolute md:bottom-full md:mb-4 md:w-[420px] md:h-[600px] 
              bg-white dark:bg-[#1E293B] shadow-2xl md:rounded-2xl 
              border border-gray-200 dark:border-gray-700 
              overflow-hidden flex flex-col transition-all duration-300 
              z-[60] animate-in slide-in-from-bottom-5
            ">
            
            {/* Widget Header */}
            <div className="p-4 bg-[#0F172A] flex justify-between items-center text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Discussion Room</span>
          </div>
          <div className="flex items-center gap-2">
            {/* On mobile, an "X" or "Close" is more intuitive than "Minimize" */}
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="md:hidden" />
              <Minimize2 size={18} className="hidden md:block" />
            </button>
          </div>
        </div>
                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <DiscussionRoom questionId={question.id} />
                </div>
              </div>
            )}

            {/* Floating Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-90 flex items-center justify-center ${
                isChatOpen ? 'bg-red-500 rotate-90' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: !isChatOpen ? BDU.ACCENT : undefined }}
            >
              {isChatOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <div className="relative">
                  <MessageSquare className="text-white" size={24} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-[#0F172A] rounded-full"></span>
                </div>
              )}
            </button>
          </div>

      {/* Modals */}
      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default QuestionDetailsPage;