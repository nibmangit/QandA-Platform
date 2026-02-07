import { useState } from "react";
import { Edit, Trash2, ThumbsUp, ThumbsDown, MessageSquare, Check, X } from "lucide-react";
import ActionButton from "../helper/ActionButton";
import AuthorDisplay from "./AuthorDisplay";
import apiPrivate from "../api/axiosPrivate";
import DeleteModal from "./DeleteModal";

const AnswerItem = ({ 
  answer, currentUser, onUpdate, onDelete, 
  onPostComment, commentInput, onCommentInputChange, 
  isOpen, onToggleComments, onLikeToggle, setAnswers 
}) => {
  const isOwner = currentUser?.email === answer.author;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(answer.body);

  // States for Comment CRUD
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Modal State for Comments
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSave = async () => {
    await onUpdate(answer.id, editText);
    setIsEditing(false);
  };

  // --- Comment CRUD Logic ---

  const handleUpdateComment = async (commentId) => {
    try {
      const resp = await apiPrivate.patch(`/questions/answers/comments/${commentId}/`, {
        body: editCommentText
      });
      
      setAnswers(prev => prev.map(ans => {
        if (ans.id === answer.id) {
          // Check if comments is paginated object or array
          const currentComments = ans.comments?.results || (Array.isArray(ans.comments) ? ans.comments : []);
          const updatedList = currentComments.map(c => c.id === commentId ? resp.data : c);
          
          return { 
            ...ans, 
            comments: ans.comments?.results ? { ...ans.comments, results: updatedList } : updatedList 
          };
        }
        return ans;
      }));
      setEditingCommentId(null);
    } catch (err) {
      console.error("Comment update failed:", err);
    }
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await apiPrivate.delete(`/questions/answers/comments/${commentToDelete}/`);
      
      setAnswers(prev => prev.map(ans => {
        if (ans.id === answer.id) {
          const currentComments = ans.comments?.results || (Array.isArray(ans.comments) ? ans.comments : []);
          const updatedList = currentComments.filter(c => c.id !== commentToDelete);
          
          return { 
            ...ans, 
            comments: ans.comments?.results ? { ...ans.comments, results: updatedList } : updatedList 
          };
        }
        return ans;
      }));
      setIsCommentModalOpen(false);
    } catch (err) {
      console.error("Comment delete failed:", err);
    }
  };

  const openCommentDeleteModal = (id) => {
    setCommentToDelete(id);
    setIsCommentModalOpen(true);
  };

  const commentsList = answer.comments?.results || (Array.isArray(answer.comments) ? answer.comments : []);

  return (
    <div className="relative bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-all">
      {/* Answer Actions */}
      {isOwner && !isEditing && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"><Edit size={16} /></button>
          <button onClick={() => onDelete(answer.id)} className="text-red-500 hover:scale-110 transition-transform cursor-pointer"><Trash2 size={16} /></button>
        </div>
      )}

      {/* Answer Body/Edit */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea 
            className="w-full p-3 border rounded-xl dark:bg-[#0F172A] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-1.5 rounded-lg text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap">{answer.body}</p>
      )}

      {/* Answer Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t dark:border-gray-700 pt-4 gap-4">
        <AuthorDisplay email={answer.author} date={answer.created_at} size="sm" label="Answered" />
        <div className="flex space-x-1">
        <ActionButton icon={ThumbsUp} label={answer.likes} active={answer.is_liked} 
          activeColor="text-blue-500" onClick={() => onLikeToggle("answer", answer.id, true)} />

        <ActionButton icon={ThumbsDown} label={answer.dislikes} active={answer.is_disliked} 
          activeColor="text-red-500" onClick={() => onLikeToggle("answer", answer.id, false)} />

        <ActionButton icon={MessageSquare} label={commentsList.length} active={isOpen}
          activeColor="text-blue-600" onClick={onToggleComments} />
        </div>
      </div>

      {/* Comments Section */}
      {isOpen && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Comments</p>
          <div className="space-y-3">
            {commentsList.map(c => {
              const isCommentOwner = currentUser?.email === c.author;
              return (
                <div key={c.id} className="group border-b dark:border-gray-800 pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <AuthorDisplay email={c.author} date={c.created_at} size="xs" label="Commented" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleTimeString()}</span>
                        {isCommentOwner && (
                            <div className="hidden group-hover:flex items-center gap-2 transition-all">
                                <button 
                                    onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.body); }} 
                                    className="text-gray-400 hover:text-yellow-500 cursor-pointer"
                                >
                                    <Edit size={12} />
                                </button>
                                <button 
                                    onClick={() => openCommentDeleteModal(c.id)} 
                                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                  
                  {editingCommentId === c.id ? (
                      <div className="flex gap-2 mt-2">
                          <input 
                            className="flex-1 p-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateComment(c.id)} className="text-green-500"><Check size={16}/></button>
                          <button onClick={() => setEditingCommentId(null)} className="text-red-500"><X size={16}/></button>
                      </div>
                  ) : (
                      <p className="text-sm dark:text-gray-300 mt-1">{c.body}</p>
                  )}
                </div>
              );
            })}
            {commentsList.length === 0 && (
                <p className="text-sm text-gray-500 italic">No comments yet.</p>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Write a comment..."
              value={commentInput || ""}
              onChange={(e) => onCommentInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onPostComment(answer.id)}
            />
            <button 
                onClick={() => onPostComment(answer.id)} 
                className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            >
                Post
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Modal for Comment Deletion */}
      <DeleteModal 
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onConfirm={confirmDeleteComment}
        title="Delete Comment?"
        message="Are you sure you want to remove this comment? This cannot be undone."
      />
    </div>
  );
};

export default AnswerItem;