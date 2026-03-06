import React, { useRef, useState } from 'react';
import axios from 'axios';
import chatService from '../../api/chatService';

const ChatInput = ({ socketRef, isAuthorized, questionId, status }) => {
    const [text, setText] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleSendMessage = (e) => {
        // Only trigger on Enter key, excluding Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            // Safe access to ref inside an event handler (Fixes ESLint error)
            const socket = socketRef?.current;

            if (!text.trim() || status !== 'connected' || !socket) return;

            // Matches our Django Consumer 'receive' logic
            socket.send(JSON.stringify({
                type: 'chat_message',
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
            if (socketRef.current) {
            socketRef.current.send(JSON.stringify({
                type: 'request_access'
                }));
            }
            setRequestSent(true);
        } catch (err) {
            console.error("Request failed", err);
            // Specifically handling the case where they might have already requested
            alert("Unable to send request. You may already have a pending application or are restricted.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            alert("Image too large. Please choose an image under 5MB.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'chat_system_uploads'); // Replace with your Cloudinary preset

        try {
            // 1. Upload to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            const imageUrl = response.data.secure_url;
            const socket = socketRef?.current;

            // 2. Send via WebSocket using the action type expected by our new Consumer logic
            if (socket && status === 'connected') {
                socket.send(JSON.stringify({
                    type: 'chat_message', // This triggers the image logic in consumers.py
                    message: "", 
                    image_url: imageUrl
                }));
            }
        } catch (err) {
            console.error("Cloudinary Upload Error:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
        if (status !== 'connected' || !socketRef.current) return;
        socketRef.current.send(JSON.stringify({ type: 'typing', is_typing: true }));
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.send(JSON.stringify({ type: 'typing', is_typing: false }));
        }, 2000);
    };

    // If not authorized by the backend (isAuthorized is false), show Request UI
    if (!isAuthorized) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {requestSent ? (
                    <div className="text-center py-2 text-sm text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                        Request sent! Waiting for approval...
                    </div>
                ) : (
                    <button
                        onClick={handleRequestAccess}
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gray-900 dark:bg-blue-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? "Processing..." : "Join Discussion (Request Access)"}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="p-2 md:p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end gap-2 max-w-full">
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <button 
                    onClick={handleImageClick}
                    disabled={isUploading || status !== 'connected'}
                    className={`p-2.5 mb-0.5 rounded-full transition-colors flex-shrink-0 ${isUploading ? 'text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    {isUploading ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>

                <div className="relative flex-1 flex items-center min-w-0">
                    <textarea
                        rows="1"
                        value={text}
                        onChange={handleInputChange}
                        onKeyDown={handleSendMessage}
                        placeholder="Type a message..."
                        /* text-[16px] is vital for mobile to prevent auto-zoom-in */
                        className="w-full pl-4 pr-12 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                                   text-[16px] md:text-sm rounded-2xl border-none focus:ring-2 focus:ring-blue-500 resize-none 
                                   transition-all placeholder-gray-500 max-h-32"
                    />
                    
                    <button 
                        onClick={executeSend}
                        disabled={!text.trim() || status !== 'connected'}
                        className={`absolute right-1.5 p-2 rounded-full transition-all active:scale-90
                                    ${text.trim() ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'text-gray-400 opacity-0'}`}
                    >
                        <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-1 px-2">
                <p className="hidden md:block text-[10px] text-gray-400">
                    Press <span className="font-bold">Enter</span> to send.
                </p>
                {status !== 'connected' && (
                    <span className="text-[10px] text-red-500 font-bold animate-pulse ml-auto">
                        Disconnected
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatInput;