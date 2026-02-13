import React, { useState } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose other styles too

import ImageZoom from '../ImageZoom';
import { Smile } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

const MessageBubble = ({ msg, isMe, isRoomOwner, socketRef, isGrouped, isSeen
 }) => { // Add socketRef here
    const {currentUser} = useAuth();
    const currentUserId = currentUser?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content);

    const [showPicker, setShowPicker] = useState(false);

    const commonEmojis = ['👍', '❤️', '🔥', '😂', '✅', '🚀'];

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
    };

    const handleDelete = () => {
        const socket = socketRef?.current;
        if (!socket) return;

        if (window.confirm("Delete this message?")) {
            // Send through WebSocket instead of chatService
            socket.send(JSON.stringify({
                type: 'delete_message',
                message_id: msg.message_id
            }));
        }
    };
    
    // ... rest of your component remains the same

return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group ${isGrouped ? '-mt-2' : 'mt-2'} w-full`}>
            
            {/* Sender Name & Role Badge */}
            {!isGrouped && (
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        {isMe ? 'You' : msg.username}
                    </span>
                    {isRoomOwner && (msg.user_id === msg.room_author_id || msg.is_author) && (
                        <span className="text-yellow-600 dark:text-yellow-400 font-black uppercase text-[8px] tracking-tighter">
                            Author
                        </span>
                    )}
                </div>
            )}

            <div className={`relative max-w-[85%] md:max-w-[70%] flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2`}>
                <div className={`p-3 rounded-2xl text-sm shadow-sm transition-colors w-full overflow-hidden flex flex-col min-w-0
                    ${isMe 
                        ? 'bg-navy-900 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-tl-none'
                    }
                    ${isGrouped ? (isMe ? 'rounded-tr-2xl' : 'rounded-tl-2xl') : ''}
                `}>
                    
                    {/* --- IMAGE DISPLAY --- */}
                    {msg.image && (
                        <div className="mb-2 max-w-full">
                            <ImageZoom src={msg.image} alt="Sent image" className="max-h-60 w-auto" />
                        </div>
                    )}

                    {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-black text-sm rounded border border-navy-200 focus:outline-none"
                                rows="3"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-[10px] text-gray-500">Cancel</button>
                                <button onClick={handleUpdate} className="text-[10px] font-bold text-navy-600">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className={`markdown-content prose prose-sm max-w-none min-w-0 w-full overflow-hidden
                            ${isMe ? 'prose-invert text-white' : 'dark:prose-invert text-gray-800 dark:text-gray-100'}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="relative w-full min-w-0 my-2">
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-md bg-gray-900 shadow-lg border border-white/10 overflow-x-auto"
                                                    customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem' }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={`px-1.5 py-0.5 rounded font-mono text-[0.9em] 
                                                ${isMe ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-pink-500'}`} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    p: ({children}) => <p className="m-0 leading-relaxed whitespace-pre-wrap wrap-break-words">{children}</p>,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* --- REACTIONS DISPLAY --- */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                                const hasReacted = userIds.includes(String(currentUserId));
                                return (
                                    <button
                                        key={emoji}
                                        onClick={() => handleToggleReaction(emoji)}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-all active:scale-90
                                            ${hasReacted 
                                                ? 'bg-navy-100 border-navy-300 dark:bg-navy-800 dark:border-navy-600' 
                                                : 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700'}`}
                                    >
                                        <span>{emoji}</span>
                                        <span className={hasReacted ? 'text-navy-700 dark:text-navy-300 font-bold' : 'text-gray-500'}>
                                            {userIds.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* --- BOTTOM ROW: TIMESTAMP & CHECKMARKS --- */}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-navy-200/70' : 'text-gray-400'}`}>
                        <span className="text-[9px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {isMe && (
                            <div className="flex items-center ml-1">
                                {isSeen ? (
                                    /* DOUBLE CHECK (Seen) - Using Cyan-400 for maximum visibility on Navy-900 */
                                    <div className="relative flex items-center w-[18px]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
                                            <path d="M2 12L7 17L12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-cyan-400 -ml-2">
                                            <path d="M7 12L12 17L22 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                ) : (
                                    /* SINGLE CHECK (Sent) - Using Gray-300 */
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                                        <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ACTIONS MENU --- */}
                {!isEditing && (
                    <div className="relative flex shrink-0 gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                            <button 
                                onClick={() => setShowPicker(!showPicker)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400"
                            >
                                <Smile size={14} />
                            </button>
                            
                            {showPicker && (
                                <div className="absolute bottom-full mb-2 left-0 z-50 flex gap-1 p-1.5 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-full animate-in zoom-in-90 duration-150">
                                    {commonEmojis.map(emoji => (
                                        <button 
                                            key={emoji} 
                                            onClick={() => handleToggleReaction(emoji)}
                                            className="hover:scale-125 transition-transform p-1"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {isMe && (
                            <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" /></svg>
                            </button>
                        )}
                        {(isMe || isRoomOwner) && (
                            <button onClick={handleDelete} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;