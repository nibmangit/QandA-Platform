import React, { useState, useEffect, useRef, useCallback } from 'react';
import chatService from '../../api/chatService';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import ChatModeration from './ChatModeration';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';

const DiscussionRoom = ({ questionId }) => {
    const {currentUser} = useAuth();
    const { showToast } = useFeedback();
    const [messages, setMessages] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isBanned, setIsBanned] = useState(false);
    const [isOwnerState, setIsOwnerState] = useState(false); 
    const [status, setStatus] = useState('connecting'); 
    const socketRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [myLastSeenAtStart, setMyLastSeenAtStart] = useState(null);
    const [othersLastSeenTime, setOthersLastSeenTime] = useState(null);

    useEffect(() => {
        if (!questionId) return;

        const loadHistory = async () => {
            try {
                const response = await chatService.getChatHistory(questionId);
                const history = [...response.data.results].reverse();
                
                setMyLastSeenAtStart(response.data.last_seen_timestamp);
                if (response.data.others_last_seen_timestamp) {
                        setOthersLastSeenTime(response.data.others_last_seen_timestamp);
                    }
                
                setIsAuthorized(response.data.user_can_write || response.data.is_owner);
                setIsOwnerState(response.data.is_owner);
                setIsBanned(response.data.is_banned || false);
                setMessages(history);  
                
                connectWebSocket();
            } catch (err) {
                console.error("Failed to load chat:", err);
                setStatus('error');
            }
        };

        const connectWebSocket = () => {
            const token = localStorage.getItem('accessToken');
            const WS_BASE_URL = import.meta.env.VITE_WS_URL;
            const wsUrl = `${WS_BASE_URL}/${questionId}/?token=${token}`;
            
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => setStatus('connected');
            
            socketRef.current.onmessage = (e) => {
                const data = JSON.parse(e.data); 
                
                switch(data.type) {
                    case 'new_message':
                        setMessages((prev) => {
                            if (prev.some(m => m.message_id === data.message_id)) return prev;
                            return [...prev, data];
                        });
                        break;

                    case 'delete_confirmation': 
                        setMessages((prev) => {
                            const filtered = prev.filter(m => String(m.message_id) !== String(data.message_id));
                            console.log("Messages after delete:", filtered.length);
                            return filtered;
                        });
                        break;

                    case 'edit_confirmation': 
                        setMessages((prev) => prev.map(m => 
                            String(m.message_id) === String(data.message_id) 
                                ? { ...m, content: data.new_content } 
                                : m
                        ));
                        break;
                    
                    case 'new_access_request':
                        console.log("Author notification: New user wants to join!");
                        // The red dot in ChatModeration handles this if you use the addEventListener approach
                        break;

                    case 'access_status_update': 
                        if (String(currentUser?.id) === String(data.target_user_id)) {
                            if (data.status === 'approved') {
                                setIsAuthorized(true);
                                showToast("Your request to join has been approved!", "success");
                            } else {
                                setIsAuthorized(false);
                                showToast("Your request to join was declined.", "error");
                            }
                        }
                        break;

                    case 'typing_indicator':
                        setTypingUsers((prev) => {
                            const newTyping = { ...prev };
                            if (data.is_typing) {
                                // Add user to typing list (but don't show myself)
                                if (String(data.user_id) !== String(currentUser?.id)) {
                                    newTyping[data.user_id] = data.username;
                                }
                            } else {
                                // Remove user from list
                                delete newTyping[data.user_id];
                            }
                            return newTyping;
                        });
                        break;
                    
                    case 'presence_update':
                        var userArray = Object.entries(data.users).map(([id, name]) => ({
                                    user_id: id,
                                    username: name
                                })); 
                        setOnlineUsers(userArray);
                        break;
                    
                    case 'reaction_broadcast':
                        setMessages(prevMessages => 
                            prevMessages.map(msg => 
                                msg.message_id === data.message_id 
                                    ? { ...msg, reactions: data.reactions } 
                                    : msg
                            )
                        );
                        break;
                    
                    case 'user_read_broadcast': 
                        if (String(data.user_id) !== String(currentUser?.id)) {
                            setOthersLastSeenTime(data.timestamp);
                        } 
                    break;

                    case 'user_banned_signal': 
                        if (String(data.target_user_id) === String(currentUser?.id)) {
                            setIsBanned(true);
                            setIsAuthorized(false);
                            showToast("You have been restricted from this room.", "error");
                            if (socketRef.current) socketRef.current.close();
                        }
                        // 2. Remove the banned user from the online list for everyone else
                        setOnlineUsers((prev) => prev.filter(u => String(u.user_id) !== String(data.target_user_id)));
                        break;

                    case 'user_unbanned_signal': 
                        if (String(data.target_user_id) === String(currentUser?.id)) {
                            setIsBanned(false);
                            showToast("Your restriction has been lifted.", "success");
                        }
                        break;
                    default:
                        console.warn("Unknown socket type:", data.type);
                        break;
                }
            };

            socketRef.current.onclose = () => setStatus('disconnected');
            socketRef.current.onerror = () => setStatus('error');
        };

        loadHistory();

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [questionId, currentUser?.id]);

    const markAsRead = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'mark_read' }));
        }
    }, [questionId]);

    if (isBanned) {
        return (
            <div className="flex flex-col items-center justify-center h-125 border rounded-lg bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🚫</span>
                </div>
                <h3 className="text-lg font-black text-red-700 dark:text-red-400 uppercase tracking-tight">Access Restricted</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
                    The author has restricted your access to this discussion. If you believe this is a mistake, please contact the author.
                </p>
            </div>
        );
    }

  return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#0F172A] overflow-hidden transition-colors duration-200">
            {/* --- HEADER --- */}
            <div className="px-4 py-3 bg-[#1E293B] dark:bg-[#111827] flex justify-between items-center text-white border-b border-gray-700 dark:border-gray-900 shrink-0">
                <div className="flex items-center gap-2">
                    {/* Status Indicator */}
                    <div className="relative flex items-center justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-500'}`} />
                        {status === 'connected' && (
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
                        )}
                    </div>
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-200">
                        Discussion Room
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {/* Online Users Avatars */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {onlineUsers.slice(0, 3).map(user => (
                                <div 
                                    key={user.user_id} 
                                    className="w-7 h-7 rounded-full bg-blue-600 border-2 border-[#1E293B] dark:border-[#111827] flex items-center justify-center text-[10px] font-bold shadow-sm" 
                                    title={user.username}
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {onlineUsers.length > 3 && (
                                <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-[#1E293B] dark:border-[#111827] flex items-center justify-center text-[10px] text-gray-300">
                                    +{onlineUsers.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-semibold text-green-400 hidden sm:block">
                            {onlineUsers.length} Online
                        </span>
                    </div>

                    {/* Moderation Controls */}
                    {isOwnerState && (
                        <div className="border-l border-gray-700 pl-3 ml-1">
                            <ChatModeration questionId={questionId} socketRef={socketRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* --- MESSAGES AREA --- */}
            <div className="flex-1 flex flex-col min-h-0 relative bg-gray-50 dark:bg-[#0F172A]">
                <ChatBox 
                    messages={messages} 
                    isOwner={isOwnerState} 
                    socketRef={socketRef} 
                    lastSeenTime={myLastSeenAtStart} 
                    othersLastSeenTime={othersLastSeenTime}
                    markAsRead={markAsRead}
                />

                {/* Floating Typing Indicator */}
                <div className="absolute bottom-2 left-4 z-20 pointer-events-none transition-all">
                    {Object.values(typingUsers).length > 0 && (
                        <div className="bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold italic flex items-center gap-2">
                                <span className="flex gap-0.5">
                                    <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                                </span>
                                {Object.values(typingUsers).join(', ')} typing...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- INPUT AREA --- */}
            <div className="shrink-0 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <ChatInput 
                    socketRef={socketRef} 
                    isAuthorized={isAuthorized} 
                    questionId={questionId} 
                    status={status} 
                />
            </div>
        </div>
    );
};

export default DiscussionRoom;