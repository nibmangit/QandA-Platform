import React, { useState } from 'react'; 

const MessageBubble = ({ msg, isMe, isRoomOwner, socketRef }) => { // Add socketRef here
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
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
            {/* Sender Name & Role Badge */}
            <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {msg.username}
                </span>
                {/* If the message username matches the author's email 
                  OR if the message was sent by the user we flagged as isRoomOwner 
                */}
                {isRoomOwner && isMe && (
                    <span className="text-yellow-600 dark:text-yellow-400 font-black uppercase text-[8px] tracking-tighter">
                        Author
                    </span>
                )}
            </div>

            <div className={`relative max-w-[85%] flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2`}>
                {/* Bubble */}
                <div className={`p-3 rounded-2xl text-sm shadow-sm transition-colors
                    ${isMe 
                        ? 'bg-navy-900 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-tl-none'
                    }`}
                >
                    {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-black text-sm rounded border border-navy-200 focus:ring-2 focus:ring-navy-500 focus:outline-none"
                                rows="2"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)} 
                                    className="text-[10px] text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpdate} 
                                    className="text-[10px] font-bold text-navy-600 hover:text-navy-800"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    )}
                </div>

                {/* Actions Menu (Show on Hover) */}
                {/* isMe can edit/delete their own. isRoomOwner can delete anyone's. */}
                {(isMe || isRoomOwner) && !isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {isMe && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400 transition-colors"
                                title="Edit"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                        <button 
                            onClick={handleDelete}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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