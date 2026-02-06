import { useState } from "react";
import { Edit, Trash2, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import ActionButton from "../helper/ActionButton";
import AuthorDisplay from "./AuthorDisplay";

const AnswerItem = ({ 
  answer, currentUser, onUpdate, onDelete, 
  onPostComment, commentInput, onCommentInputChange, 
  isOpen, onToggleComments 
}) => {
  const isOwner = currentUser?.email === answer.author;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(answer.body);

  const handleSave = async () => {
    await onUpdate(answer.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="relative bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-all">
      {isOwner && !isEditing && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="text-yellow-500 hover:scale-110 transition-transform"><Edit size={16} /></button>
          <button onClick={() => onDelete(answer.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <textarea 
            className="w-full p-3 border rounded-xl dark:bg-[#0F172A] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-1.5 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap">{answer.body}</p>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t dark:border-gray-700 pt-4 gap-4">
        <AuthorDisplay email={answer.author} date={answer.created_at} />
        <div className="flex space-x-2">
          <ActionButton icon={ThumbsUp} label={answer.likes} />
          <ActionButton icon={ThumbsDown} label={answer.dislikes} />
          <ActionButton 
            icon={MessageSquare} 
            label={answer.comments?.length || 0} 
            onClick={onToggleComments} 
            active={isOpen}
          />
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Comments</p>
          <div className="space-y-3">
            {answer.comments?.map(c => (
              <div key={c.id} className="group border-b dark:border-gray-800 pb-2 last:border-0">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-blue-500">{c.author}</span>
                  <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm dark:text-gray-300 mt-1">{c.body}</p>
              </div>
            ))}
            {(!answer.comments || answer.comments.length === 0) && (
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
            <button onClick={() => onPostComment(answer.id)} className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerItem;