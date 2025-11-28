import { useState } from "react";
import { Calendar, Edit, Trash2, ThumbsUp, ThumbsDown, MessageSquare, Zap, CornerUpRight, BookOpen,} from "lucide-react";
import { MOCK_QUESTIONS, MOCK_ANSWERS } from "../utils/mock/mockData";
import { findCategory, findUser } from "../utils/Find";
import { BDU } from "../utils/css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "../Components/DeleteModal";
import StatButton from "../helper/StatButton";
import ActionButton from "../helper/ActionButton";

const generateUUID = () => crypto.randomUUID().slice(0, 8); 

const QuestionDetailsPage = ({ onDelete }) => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const questionId = id;
  const navigate = useNavigate();
  const question = MOCK_QUESTIONS.find((q) => q.id === questionId);

  // Local answers state: copy answers for this question into state and ensure each answer has comments array
  const [answers, setAnswers] = useState(() =>
    MOCK_ANSWERS.filter((a) => a.questionId === questionId).map((a) => ({
      ...a,
      comments: Array.isArray(a.comments) ? [...a.comments] : [], // keep comments if present
    }))
  );

  const [answerCount, setAnswerCount] = useState(question?.answers || answers.length);

  const author = findUser(question?.authorId);
  const category = findCategory(question?.categoryId);
  const relatedQuestions = MOCK_QUESTIONS.filter(
    (q) => q.id !== questionId && q.categoryId === question?.categoryId
  ).slice(0, 3);

  const [newAnswer, setNewAnswer] = useState("");
  // commentInputs: { [answerId]: "text" }
  const [commentInputs, setCommentInputs] = useState({});
  // UI state:
  const [openCommentsFor, setOpenCommentsFor] = useState(null); // answerId or null
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // deleteTarget: { type: 'question'|'answer'|'comment', answerId?, commentId? }
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!question) return <div className="p-10 text-center text-red-500">Question not found.</div>;

  const isQuestionOwner = currentUser?.id === question.authorId;

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

  const handleLike = (answerId) => {
    setAnswers((prev) => prev.map((a) => (a.id === answerId ? { ...a, likes: a.likes + 1 } : a)));
  };

  const handleDislike = (answerId) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === answerId ? { ...a, dislikes: a.dislikes + 1 } : a))
    );
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

    // clear input for that answer
    setCommentInputs((prev) => ({ ...prev, [answerId]: "" }));
    // ensure comments panel open
    setOpenCommentsFor(answerId);
  };

  const startEditComment = (answerId, commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
    // ensure comments are open for this answer
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

  // ----------------- Question delete (uses onDelete prop) -----------------
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
      // call parent's onDelete
      if (onDelete) onDelete(question.id);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Question Details */}
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{question.title}</h1>
                {isQuestionOwner && (
                  <div className="flex space-x-2">
                    <button
                      className="flex items-center text-sm text-yellow-500 hover:text-yellow-600 hover:cursor-pointer"
                      onClick={() => navigate(`/edit-question/${question.id}`)}
                      title="Edit"
                    >
                      <Edit size={16} className="mr-1" />
                    </button>
                    <button
                      className="flex items-center text-sm text-red-500 hover:text-red-600 hover:cursor-pointer"
                      onClick={confirmDeleteQuestion}
                      title="Delete"
                    >
                      <Trash2 size={16} className="mr-1" />
                    </button>
                  </div>
                )}
              </div>

              <p className={`flex font-semibold text-blue-600 dark:text-[#3B82F6]`}>@ {category?.name}</p>
              <br />
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                <img src={author?.avatar} alt={author?.name} className="h-8 w-8 rounded-full object-cover" />
                <span>
                  Asked by{" "}
                  <button onClick={() => navigate(`/profile/${author?.id}`)} className="font-semibold hover:underline hover:cursor-pointer text-blue-600 dark:text-blue-400">
                    {author?.name}
                  </button>
                </span>
                <span>•</span>
                <Calendar size={14} />
                <span>{new Date(question.date).toLocaleDateString()}</span>
              </div>

              {question.image && (
                <img src={question.image} alt="Question Diagram" className="w-full max-h-80 object-cover rounded-xl my-4 border border-gray-200 dark:border-gray-700" />
              )}

              <p className="text-base leading-relaxed mb-6 text-gray-900 dark:text-gray-100">{question.body}</p>

              
              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex space-x-4">
                  <StatButton count={question.likes} icon={ThumbsUp} colorClass="text-green-500" label="Upvotes" />
                  <StatButton count={question.dislikes} icon={ThumbsDown} colorClass="text-red-500" label="Downvotes" />
                  <StatButton
                    count={answerCount}
                    icon={MessageSquare}
                    colorClass="text-blue-500"
                    label="Answers"
                    onClick={() => setOpenCommentsFor(null) || setOpenCommentsFor("toggle-answers") /* dummy toggle handled below */}
                  />
                </div>
              </div>
            </div>

            {/* Answers List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
              </h3>

              {answers?.map((answer) => (
                <div key={answer.id} className="relative bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                   
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

                  {/* Answer body or edit textarea */}
                  {editingAnswerId === answer.id ? (
                    <div>
                      <textarea
                        value={editingAnswerText}
                        onChange={(e) => setEditingAnswerText(e.target.value)}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100"
                        rows={4}
                      />
                      <div className="mt-2 flex space-x-2">
                        <button onClick={() => handleEditAnswer(answer.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                        <button onClick={() => { setEditingAnswerId(null); setEditingAnswerText(""); }} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4">{answer.body}</p>
                  )}

                  {/* Bottom section */}
                  <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <img src={findUser(answer.authorId).avatar} alt={findUser(answer.authorId).name} className="h-6 w-6 rounded-full object-cover" />
                      <span>
                        Answered by{" "}
                        <span className="font-semibold hover:underline hover:cursor-pointer text-blue-600 dark:text-blue-400">
                          {findUser(answer.authorId).name}
                        </span>
                      </span>
                      <span className="text-xs">{new Date(answer.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <ActionButton icon={ThumbsUp} label={answer.likes} onClick={() => handleLike(answer.id)} />
                      <ActionButton icon={ThumbsDown} label={answer.dislikes} onClick={() => handleDislike(answer.id)} />
                      <ActionButton
                        icon={MessageSquare}
                        label="Comment"
                        onClick={() => toggleComments(answer.id)}
                      />
                    </div>
                  </div>
 
                  {openCommentsFor === answer.id && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0F172A] rounded-xl space-y-3">
                      <p className="text-xs font-semibold border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-500 dark:text-gray-400">Comments</p>
 
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {answer.comments.length === 0 && <div className="text-gray-500">No comments yet.</div>}
                        {answer.comments.map((c) => (
                          <div key={c.id} className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {findUser(c.authorId)?.name || "Anonymous"}
                                <span className="ml-2 text-xs text-gray-500">{new Date(c.date).toLocaleTimeString()}</span>
                              </div>

                              {editingCommentId === c.id ? (
                                <div className="mt-1">
                                  <input
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-[#0F172A] dark:text-gray-100"
                                  />
                                  <div className="mt-1 flex gap-2">
                                    <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => handleEditComment(answer.id)}>Save</button>
                                    <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => { setEditingCommentId(null); setEditingCommentText(""); }}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1 text-sm">{c.body}</div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {currentUser?.id === c.authorId && (
                                <>
                                  <button title="Edit" onClick={() => startEditComment(answer.id, c.id, c.body)} className="text-yellow-500"><Edit size={14} /></button>
                                  <button title="Delete" onClick={() => confirmDeleteComment(answer.id, c.id)} className="text-red-500"><Trash2 size={14} /></button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentInputs[answer.id] || ""}
                          onChange={(e) => handleCommentInputChange(answer.id, e.target.value)}
                          className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-[#0F172A] dark:text-gray-100"
                        />
                        <button onClick={() => handlePostComment(answer.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Post</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Answer Form */}
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
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
            <div className="sticky top-24 bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Actions</h3>
              <div className="space-y-3">
                <ActionButton icon={Zap} label="Report" onClick={() => console.log("Reported")} />
                <ActionButton icon={CornerUpRight} label="Share" onClick={() => console.log("Shared")} />
                <ActionButton icon={BookOpen} label="Save" onClick={() => console.log("Saved")} />
              </div>
            </div>

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

      {/* Delete modal */}
      <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default QuestionDetailsPage;
