import React, { useState } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose other styles too

import ImageZoom from '../ImageZoom';

const MessageBubble = ({ msg, isMe, isRoomOwner, socketRef, isGrouped
 }) => { // Add socketRef here
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content);

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
                            <ImageZoom
                                src={msg.image} 
                                alt="Sent image" 
                                className="max-h-60 w-auto" 
                            />
                        </div>
                    )}

                    {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-black text-sm rounded border border-navy-200 focus:ring-2 focus:ring-navy-500 focus:outline-none"
                                rows="3"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-[10px] text-gray-500 hover:text-gray-700">Cancel</button>
                                <button onClick={handleUpdate} className="text-[10px] font-bold text-navy-600 hover:text-navy-800">Save</button>
                            </div>
                        </div>
                    ) : (
                        /* --- MARKDOWN RENDERER --- */
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
                                                    className="rounded-md bg-gray-900! shadow-lg border border-white/10 custom-scrollbar overflow-x-auto"
                                                    customStyle={{
                                                        margin: 0,
                                                        padding: '1rem',
                                                        fontSize: '0.85rem',
                                                        lineHeight: '1.5',
                                                        maxWidth: '100%'
                                                    }}
                                                    codeTagProps={{
                                                        style: { whiteSpace: 'pre', wordBreak: 'normal' }
                                                    }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={`px-1.5 py-0.5 rounded font-mono text-[0.9em] 
                                                ${isMe ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-pink-500'}`} 
                                                {...props}
                                            >
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
                </div>

                {/* Actions Menu */}
                {(isMe || isRoomOwner) && !isEditing && (
                    <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity flex shrink-0 gap-1">
                        {isMe && (
                            <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" /></svg>
                            </button>
                        )}
                        <button onClick={handleDelete} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Timestamp */}
            <span className="text-[9px] text-gray-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export default MessageBubble;