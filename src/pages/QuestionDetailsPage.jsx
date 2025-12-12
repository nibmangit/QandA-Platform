import { useRef, useState } from "react";
import {Edit, Trash2, ThumbsUp, ThumbsDown, MessageSquare} from "lucide-react";
import { MOCK_QUESTIONS, MOCK_ANSWERS } from "../utils/mock/mockData";
import {findUser } from "../utils/Find";
import { BDU } from "../utils/css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "../Components/DeleteModal";
import QuestionCard from "../Components/QuestionCard"; 
import ActionButton from "../helper/ActionButton";

const generateUUID = () => crypto.randomUUID().slice(0, 8); 

const QuestionDetailsPage = ({ onDelete }) => {
   const bottomRef = useRef(null);
  const { currentUser } = useAuth();
  const { id } = useParams();
  const questionId = id;
  const navigate = useNavigate();
  const question = MOCK_QUESTIONS.find((q) => q.id === questionId); 
  const [answers, setAnswers] = useState(() =>
    MOCK_ANSWERS.filter((a) => a.questionId === questionId).map((a) => ({
      ...a,
      comments: Array.isArray(a.comments) ? [...a.comments] : [], // keep comments if present
    }))
  );
console.log(answers)
  const [answerCount, setAnswerCount] = useState(question?.answers || answers.length);
 
  const relatedQuestions = MOCK_QUESTIONS.filter(
    (q) => q.id !== questionId && q.categoryId === question?.categoryId
  ).slice(0, 3);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false); 
  const [newAnswer, setNewAnswer] = useState(""); 
  const [commentInputs, setCommentInputs] = useState({}); 
  const [openCommentsFor, setOpenCommentsFor] = useState(null);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!question) return <div className="p-10 text-center text-red-500">Question not found.</div>;
 
  // ----------------- Answer operations -----------------
  const handlePostAnswer = () => {
    if (!newAnswer.trim()) return;
    const newA = {
      id: generateUUID(),
      questionId,
      authorId: currentUser?.id || "anonymous",
      body: newAnswer.trim(),
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString(),
      comments: [],
    };
    setAnswers((prev) => [newA, ...prev]);
    setAnswerCount((c) => c + 1);
    setNewAnswer("");
  };

  const handleEditAnswer = (answerId) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === answerId ? { ...a, body: editingAnswerText } : a))
    );
    setEditingAnswerId(null);
    setEditingAnswerText("");
  };

  const confirmDeleteAnswer = (answerId) => {
    setDeleteTarget({ type: "answer", answerId });
    setIsModalOpen(true);
  };

  const deleteAnswer = (answerId) => {
    setAnswers((prev) => prev.filter((a) => a.id !== answerId));
    setAnswerCount((c) => Math.max(0, c - 1));
    setIsModalOpen(false);
    setDeleteTarget(null);
  };

  const handleLike = () => {
     setLiked(prev => !prev);
    if (!liked && disliked) setDisliked(false);
  };

  const handleDislike = () => {
     setDisliked(prev => !prev);
    if (!disliked && liked) setLiked(false);
  };

  // ----------------- Comment operations -----------------
  const toggleComments = (answerId) => {
    setOpenCommentsFor((prev) => (prev === answerId ? null : answerId));
  };

  const handleCommentInputChange = (answerId, value) => {
    setCommentInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  const handlePostComment = (answerId) => {
    const text = (commentInputs[answerId] || "").trim();
    if (!text) return;

    const newComment = {
      id: generateUUID(),
      authorId: currentUser?.id || "anonymous",
      body: text,
      date: new Date().toISOString(),
    };

    setAnswers((prev) =>
      prev.map((a) => (a.id === answerId ? { ...a, comments: [...a.comments, newComment] } : a))
    );
 
    setCommentInputs((prev) => ({ ...prev, [answerId]: "" })); 
    setOpenCommentsFor(answerId);
  };

  const startEditComment = (answerId, commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText); 
    setOpenCommentsFor(answerId);
  };

  const handleEditComment = (answerId) => {
    if (!editingCommentId) return;
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId
          ? {
              ...a,
              comments: a.comments.map((c) => (c.id === editingCommentId ? { ...c, body: editingCommentText } : c)),
            }
          : a
      )
    );
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const confirmDeleteComment = (answerId, commentId) => {
    setDeleteTarget({ type: "comment", answerId, commentId });
    setIsModalOpen(true);
  };

  const deleteComment = (answerId, commentId) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === answerId ? { ...a, comments: a.comments.filter((c) => c.id !== commentId) } : a))
    );
    setIsModalOpen(false);
    setDeleteTarget(null);
  };
 
  const confirmDeleteQuestion = () => {
    setDeleteTarget({ type: "question", questionId: question.id });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { type } = deleteTarget;
    if (type === "answer") deleteAnswer(deleteTarget.answerId);
    else if (type === "comment") deleteComment(deleteTarget.answerId, deleteTarget.commentId);
    else if (type === "question") {
      setIsModalOpen(false);
      setDeleteTarget(null); 
      if (onDelete) onDelete(question.id);
    }
  }; 

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> 
          <div className="lg:col-span-3 space-y-8">
            <QuestionCard
              question={question}
              onDelete={confirmDeleteQuestion}
              showImage={true}
              showFullBody={true}
            />
 
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
                </h3>

                {answers?.map((answer) => (
                  <div
                    key={answer.id}
                    className="relative bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
                  >
                    {/* Edit/Delete for own answer */}
                    {currentUser?.id === answer.authorId && (
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          className="flex items-center text-sm text-yellow-500 hover:text-yellow-600"
                          onClick={() => {
                            setEditingAnswerId(answer.id);
                            setEditingAnswerText(answer.body);
                          }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="flex items-center text-sm text-red-500 hover:text-red-600"
                          onClick={() => confirmDeleteAnswer(answer.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Answer body / Edit textarea */}
                    {editingAnswerId === answer.id ? (
                      <div>
                        <textarea
                          value={editingAnswerText}
                          onChange={(e) => setEditingAnswerText(e.target.value)}
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100"
                          rows={4}
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEditAnswer(answer.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingAnswerId(null);
                              setEditingAnswerText("");
                            }}
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4">
                        {answer.body}
                      </p>
                    )}

                    {/* Bottom section: responsive row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                      {/* Author info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <img
                          src={findUser(answer.authorId).avatar}
                          alt={findUser(answer.authorId).name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span>
                          Answered by{" "}
                          <span className="font-semibold hover:underline hover:cursor-pointer text-blue-600 dark:text-blue-400">
                            {findUser(answer.authorId).name}
                          </span>
                        </span>
                        <span className="text-xs">{new Date(answer.date).toLocaleDateString()}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex mt-2 sm:mt-0 space-x-2">
                        <ActionButton
                          filled={liked ? "#FBBF24" : "none"}
                          icon={ThumbsUp}
                          label={answer.likes}
                          onClick={handleLike}
                        />
                        <ActionButton
                          filled={disliked ? "#FBBF24" : "none"}
                          icon={ThumbsDown}
                          label={answer.dislikes}
                          onClick={handleDislike}
                        />
                        <ActionButton
                          icon={MessageSquare}
                          label="Comment"
                          onClick={() => toggleComments(answer.id)}
                        />
                      </div>
                    </div>

                    {/* Comments section */}
                    {openCommentsFor === answer.id && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0F172A] rounded-xl space-y-3">
                        <p className="text-xs font-semibold border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-500 dark:text-gray-400">
                          Comments
                        </p>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          {answer.comments.length === 0 && (
                            <div className="text-gray-500">No comments yet.</div>
                          )}
                          {answer.comments.map((c) => (
                            <div key={c.id} className="flex flex-col sm:flex-row justify-between gap-3">
                              <div>
                                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                  {findUser(c.authorId)?.name || "Anonymous"}
                                  <span className="ml-2 text-xs text-gray-500">
                                    {new Date(c.date).toLocaleTimeString()}
                                  </span>
                                </div>

                                {editingCommentId === c.id ? (
                                  <div className="mt-1">
                                    <input
                                      value={editingCommentText}
                                      onChange={(e) => setEditingCommentText(e.target.value)}
                                      className="w-full p-2 border rounded dark:bg-[#0F172A] dark:text-gray-100"
                                    />
                                    <div className="mt-1 flex gap-2 flex-wrap">
                                      <button
                                        className="px-2 py-1 bg-blue-600 text-white rounded"
                                        onClick={() => handleEditComment(answer.id)}
                                      >
                                        Save
                                      </button>
                                      <button
                                        className="px-2 py-1 bg-gray-200 rounded"
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setEditingCommentText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-1 text-sm">{c.body}</div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                {currentUser?.id === c.authorId && (
                                  <>
                                    <button
                                      title="Edit"
                                      onClick={() => startEditComment(answer.id, c.id, c.body)}
                                      className="text-yellow-500"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      title="Delete"
                                      onClick={() => confirmDeleteComment(answer.id, c.id)}
                                      className="text-red-500"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add comment input */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInputs[answer.id] || ""}
                            onChange={(e) => handleCommentInputChange(answer.id, e.target.value)}
                            className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-[#0F172A] dark:text-gray-100"
                          />
                          <button
                            onClick={() => handlePostComment(answer.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>


            {/* Add Answer Form */}
            <div ref={bottomRef} className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Answer</h3>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Provide a detailed, helpful answer..."
                rows="6"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-blue-400 focus:border-blue-400 dark:bg-[#0F172A] dark:text-gray-100"
              />
              <button
                onClick={handlePostAnswer}
                className="mt-4 px-6 py-3 text-white font-bold rounded-xl shadow-md transition-all hover:opacity-90"
                style={{ backgroundColor: BDU.ACCENT }}
              >
                Post Your Answer
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">  
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related Questions</h3>
              <div className="space-y-3">
                {relatedQuestions?.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => navigate(`/question/${q.id}`)}
                    className="block w-full text-left text-sm font-medium hover:text-blue-400 transition-colors text-gray-900 dark:text-gray-100 border-b border-dashed border-gray-200 dark:border-gray-700 pb-2"
                  >
                    {q.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default QuestionDetailsPage;
