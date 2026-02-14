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
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full group relative ${isGrouped ? 'mt-1' : 'mt-4'}`}>
            
            {/* 1. TOP ROW: Metadata & Floating Actions */}
            <div className={`flex items-center gap-3 mb-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isGrouped && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                            {isMe ? 'You' : msg.username}
                        </span> 
                    </div>
                )}
                
                {/* Floating Action Menu (Appears on Hover) */}
                {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg p-0.5 scale-90 group-hover:scale-100">
                        <button onClick={() => setShowPicker(!showPicker)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 transition-colors cursor-pointer">
                            <Smile size={14} />
                        </button>
                        {isMe && (
                            <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 cursor-pointer ">
                                <Pencil size={14} />
                            </button>
                        )}
                        {(isMe || isRoomOwner) && (
                            <button onClick={handleDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 size={14} />
                            </button>
                        )}
                        {isRoomOwner && !isMe && (
                        <button 
                            onClick={handleBan}
                            className="p-1.5 hover:bg-red-600 hover:text-white rounded text-red-500 transition-all cursor-pointer"
                            title={`Ban ${msg.username}`}
                        >
                            <ShieldCheck size={14} />
                        </button>
                    )}
                    </div>
                )}
            </div>

            {/* Emoji Picker Dropdown - Horizontally Scrollable */}
            {showPicker && (
                <div className={`absolute z-100 top-8 ${isMe ? 'right-0' : 'left-0'}  
                    max-w-[200px] sm:max-w-[300px] overflow-x-auto scrollbar-none
                    flex gap-1 p-2 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 
                    rounded-2xl animate-in fade-in zoom-in-95
                `}>
                    <div className="flex gap-1 items-center px-1">
                        {commonEmojis.map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={() => handleToggleReaction(emoji)} 
                                className="hover:scale-125 transition-transform p-1 text-lg shrink-0 cursor-pointer"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. MIDDLE ROW: Main Content Card */}
            <div className={`relative max-w-[90%] md:max-w-[80%] lg:max-w-[70%] group-hover:shadow-md transition-shadow duration-300
                ${isMe 
                    ? 'bg-navy-900 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none'
                } p-3 sm:p-4`}>
                 
                {msg.image && (
                    <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                        <ImageZoom src={msg.image} alt="Upload" className="max-h-[350px] w-full object-cover" />
                    </div>
                )}

                {/* Text / Markdown Content */}
                {isEditing ? (
                    <div className="flex flex-col gap-3 min-w-[280px]">
                        <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm rounded-lg border border-blue-500/50 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all cursor-pointer">
                                <X size={12} /> CANCEL
                            </button>
                            <button onClick={handleUpdate} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-black bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg cursor-pointer">
                                <Check size={12} /> SAVE CHANGES
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`markdown-content prose prose-sm max-w-none break-words 
                            text-gray-800 dark:text-gray-100 dark:prose-invert
                        }`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="my-3 overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.8rem', background: '#0d1117' }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className={`px-1.5 py-0.5 rounded font-mono text-[0.9em] 
                                            ${isMe ? 'bg-white/10 text-white' : 'bg-gray-100 dark:bg-gray-900 text-pink-500 border dark:border-gray-700'}`} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                p: ({children}) => <p className="m-0 leading-relaxed whitespace-pre-wrap">{children}</p>,
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
 
            <div className={`flex flex-col gap-1.5 mt-2 ${isMe ? 'items-end' : 'items-start'} w-full max-w-[85%]`}>
                {/* Reactions Display - Contained & Scrollable */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700
                        ${isMe ? 'justify-end' : 'justify-start'} 
                        /* Capping the height at roughly 3 rows of emojis */
                        max-h-[85px] w-full p-0.5
                    `}>
                        {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                            const hasReacted = userIds.includes(String(currentUserId));
                            return (
                                <button
                                    key={emoji}
                                    onClick={() => handleToggleReaction(emoji)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border transition-all active:scale-90 shrink-0 cursor-pointer
                                        ${hasReacted 
                                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' 
                                            : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}
                                >
                                    <span>{emoji}</span>
                                    <span className={`font-black ${hasReacted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                        {userIds.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Timestamp and Seen Status */}
                <div className={`flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {isMe && (
                        <div className="flex items-center">
                            {isSeen ? (
                                <div className="flex text-blue-400 dark:text-blue-500">
                                    <Check size={12} strokeWidth={4} className="-mr-1.5" />
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            ) : (
                                <Check size={12} strokeWidth={3} className="text-gray-300 dark:text-gray-600" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;