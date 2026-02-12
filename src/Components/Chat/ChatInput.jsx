import React, { useState } from 'react';
import chatService from '../../api/chatService';

const ChatInput = ({ socketRef, isAuthorized, questionId, status }) => {
    const [text, setText] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendMessage = (e) => {
        // Only trigger on Enter key, excluding Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            // Safe access to ref inside an event handler (Fixes ESLint error)
            const socket = socketRef?.current;

            if (!text.trim() || status !== 'connected' || !socket) return;

            // Matches our Django Consumer 'receive' logic
            socket.send(JSON.stringify({
                type: 'message',
                message: text.trim()
            }));

            setText("");
        }
    };

    const handleRequestAccess = async () => {
        setIsSubmitting(true);
        try {
            // We pass the questionId; backend maps it to the DiscussionRoom
            await chatService.requestWriteAccess(questionId, "I would like to contribute to this discussion.");
            setRequestSent(true);
        } catch (err) {
            console.error("Request failed", err);
            // Specifically handling the case where they might have already requested
            alert("Unable to send request. You may already have a pending application or are restricted.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // If not authorized by the backend (isAuthorized is false), show Request UI
    if (!isAuthorized) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {requestSent ? (
                    <div className="text-center py-2 text-sm text-navy-600 dark:text-blue-400 font-bold animate-pulse">
                        Request sent! Waiting for author approval...
                    </div>
                ) : (
                    <button
                        onClick={handleRequestAccess}
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50 active:scale-95"
                    >
                        {isSubmitting ? "Processing..." : "Join Discussion (Request Access)"}
                    </button>
                )}
            </div>
        );
    }

    // Return the active input field for Authorized users and the Owner
    return (
        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="relative flex items-center">
                <textarea
                    rows="1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleSendMessage}
                    placeholder="Type your message..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                               text-sm rounded-2xl border-none focus:ring-2 focus:ring-navy-600 resize-none 
                               transition-all placeholder-gray-500"
                />
                
                <button 
                    onClick={() => handleSendMessage({ key: 'Enter', preventDefault: () => {} })}
                    className={`absolute right-2 p-2 rounded-full transition-transform active:scale-90
                                ${text.trim() ? 'text-navy-900 dark:text-blue-400' : 'text-gray-400'}`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-[9px] text-gray-400">
                    Press <span className="font-bold">Enter</span> to send.
                </p>
                {status !== 'connected' && (
                    <span className="text-[9px] text-red-500 font-bold animate-pulse">
                        Reconnecting...
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatInput;