import React, { useState } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose other styles too

import ImageZoom from '../ImageZoom';
import { Smile, Pencil, Trash2, X, Check, ShieldCheck } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';

const MessageBubble = ({ msg, isMe, isRoomOwner, socketRef, isGrouped, isSeen
 }) => { // Add socketRef here
    const {currentUser} = useAuth();
    const { showToast, askConfirmation } = useFeedback();
    const currentUserId = currentUser?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content);

    const [showPicker, setShowPicker] = useState(false); 

    const commonEmojis = ['👏','🙌','🤝','💡','🧠','🎯','📌','🤔','🧐','😄','😮','⚡','🛠️','🔍','⭐','🏆','📚','💬','🧩','🙏'];

    const handleToggleReaction = (emoji) => {
        const socket = socketRef?.current;
        if (!socket || !currentUserId) return;

        socket.send(JSON.stringify({
            type: 'toggle_reaction',
            message_id: msg.message_id,
            emoji: emoji
        }));
        setShowPicker(false);
    };

    const handleUpdate = () => {
        const socket = socketRef?.current;
        if (!editContent.trim() || !socket) return;

        // Send through WebSocket instead of chatService
        socket.send(JSON.stringify({
            type: 'edit_message',
            message_id: msg.message_id,
            message: editContent.trim() // 'message' matches your consumer's data.get('message')
        }));
        
        setIsEditing(false);
        showToast("Message updated");
    };

    const handleDelete = async () => {
        const socket = socketRef?.current;
        if (!socket) return;

        const confirmed = await askConfirmation({
            title: "Delete Message?",
            message: "This will permanently remove this message for everyone in the room.",
            confirmText: "Delete",
            danger: true
        });

        if (confirmed) {
            // Send through WebSocket instead of chatService
            socket.send(JSON.stringify({
                type: 'delete_message',
                message_id: msg.message_id
            }));
            showToast("Message deleted", "error");
        }
    };

    const handleBan = async () => {
        const socket = socketRef?.current;
        if (!socket) return; 

        const confirmed = await askConfirmation({
            title: `Ban ${msg.username}?`,
            message: "They will be removed from the chat immediately and won't be able to re-join until you unban them.",
            confirmText: "Ban User",
            danger: true
        });

        if (confirmed) {
            socket.send(JSON.stringify({
                type: 'ban_user',
                user_id: msg.user_id
            }));
            showToast(`${msg.username} has been banned`, "error");
        }
    };
    

return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full group relative ${isGrouped ? 'mt-0.5' : 'mt-4'} transition-all`}>
            
            {/* 1. METADATA & ACTIONS */}
            <div className={`flex items-center gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                {!isGrouped && (
                    <span className="text-[10px] md:text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {isMe ? 'You' : msg.username}
                    </span>
                )}
                
                {/* Floating Action Menu - Optimized for Mobile (Higher Z-Index) */}
                {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 md:group-hover:opacity-100 group-active:opacity-100 transition-all duration-200 bg-white dark:bg-[#1E293B] shadow-lg border border-gray-100 dark:border-gray-700 rounded-full px-1.5 py-0.5 z-30 transform scale-90 md:scale-100">
                        <button onClick={() => setShowPicker(!showPicker)} className="p-1 hover:text-blue-500 text-gray-400 transition-colors cursor-pointer">
                            <Smile size={14} />
                        </button>
                        {isMe && (
                            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-blue-500 text-gray-400 cursor-pointer">
                                <Pencil size={14} />
                            </button>
                        )}
                        {(isMe || isRoomOwner) && (
                            <button onClick={handleDelete} className="p-1 hover:text-red-500 text-gray-400 cursor-pointer">
                                <Trash2 size={14} />
                            </button>
                        )}
                        {isRoomOwner && !isMe && (
                            <button onClick={handleBan} className="p-1 text-red-400 hover:text-red-600 cursor-pointer">
                                <ShieldCheck size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Emoji Picker - Mobile-Friendly Position */}
            {showPicker && (
                <div className={`absolute z-50 top-6 ${isMe ? 'right-0' : 'left-0'} 
                    w-[260px] md:w-[320px] bg-white dark:bg-[#1E293B] shadow-2xl border border-gray-200 dark:border-gray-700 
                    rounded-2xl p-2 animate-in fade-in zoom-in-95
                `}>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {commonEmojis.map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={() => handleToggleReaction(emoji)} 
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1.5 text-lg transition-all active:scale-125 cursor-pointer"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. MAIN BUBBLE */}
            <div className={`relative max-w-[92%] md:max-w-[75%] shadow-sm
                ${isMe 
                    ? 'bg-[#1E293B] dark:bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none'
                } px-3 py-2 md:px-4 md:py-3 transition-colors duration-200`}>
                 
                {msg.image && (
                    <div className="mb-2 overflow-hidden rounded-lg border border-black/5 dark:border-white/5">
                        <ImageZoom src={msg.image} alt="Upload" className="max-h-[300px] w-full object-cover" />
                    </div>
                )}

                {isEditing ? (
                    <div className="flex flex-col gap-2 min-w-[240px] md:min-w-[300px]">
                        <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 text-xs rounded-lg border border-blue-500/50 outline-none"
                            rows="3"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-[9px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded uppercase">Cancel</button>
                            <button onClick={handleUpdate} className="px-3 py-1 text-[9px] font-black bg-blue-500 text-white rounded uppercase shadow-sm">Save</button>
                        </div>
                    </div>
                ) : (
                    <div className={`markdown-content prose prose-xs md:prose-sm max-w-none break-words leading-relaxed
                            ${isMe ? 'prose-invert text-white' : 'dark:prose-invert text-gray-800 dark:text-gray-100'}
                        `}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="my-2 overflow-hidden rounded-lg shadow-inner">
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: '#0d1117' }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className={`px-1 rounded font-mono text-[0.85em] ${isMe ? 'bg-white/20 text-blue-100' : 'bg-gray-100 dark:bg-[#0F172A] text-pink-500'}`} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                p: ({children}) => <p className="m-0 whitespace-pre-wrap">{children}</p>,
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
 
            {/* 3. FOOTER (REACTIONS & STATUS) */}
            <div className={`flex flex-col gap-1 mt-1 ${isMe ? 'items-end' : 'items-start'} w-full`}>
                {/* Reactions Container */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 max-w-[90%] ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                            const hasReacted = userIds.includes(String(currentUserId));
                            return (
                                <button
                                    key={emoji}
                                    onClick={() => handleToggleReaction(emoji)}
                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border transition-all active:scale-90
                                        ${hasReacted 
                                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-600 dark:border-blue-400 text-blue-700 dark:text-white' 
                                            : 'bg-white border-gray-200 dark:bg-[#1E293B] dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    <span>{emoji}</span>
                                    <span className="font-bold">{userIds.length}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Status Bar */}
                <div className="flex items-center gap-1.5 px-1 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && (
                        <div className="flex items-center">
                            {isSeen ? (
                                <div className="flex text-blue-400">
                                    <Check size={10} strokeWidth={4} className="-mr-1.2" />
                                    <Check size={10} strokeWidth={4} />
                                </div>
                            ) : (
                                <Check size={10} strokeWidth={3} className="opacity-50" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;