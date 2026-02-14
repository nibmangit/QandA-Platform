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
                
                console.log("Loaded chat history:", response.data);
                
                connectWebSocket();
            } catch (err) {
                console.error("Failed to load chat:", err);
                setStatus('error');
            }
        };

        const connectWebSocket = () => {
            const token = localStorage.getItem('accessToken');
            const wsUrl = `ws://127.0.0.1:8000/ws/chat/${questionId}/?token=${token}`;
            
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
            <div className="flex flex-col items-center justify-center h-[500px] border rounded-lg bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 p-8 text-center">
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
        <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3 bg-navy-900 flex justify-between items-center text-white bg-gray-400">

                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Discussion Room</h3>
                </div>
                {/* Inside the Header div of DiscussionRoom.jsx */}
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 3).map(user => (
                        <div key={user.user_id} className="w-6 h-6 rounded-full bg-cyan-700 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold" title={user.username}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {onlineUsers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-navy-900 flex items-center justify-center text-[10px]">
                            +{onlineUsers.length - 3}
                        </div>
                    )}
                </div>
                <span className="text-[10px] text-green-900">{onlineUsers.length} online</span>
            </div>
                {isOwnerState && <ChatModeration questionId={questionId} socketRef={socketRef} />}
            </div>

            <ChatBox 
                messages={messages} 
                isOwner={isOwnerState} 
                socketRef={socketRef} 
                lastSeenTime={myLastSeenAtStart} 
                othersLastSeenTime={othersLastSeenTime}
                markAsRead={markAsRead}
                />


            {/* Typing Indicator UI */}
                <div className="h-6 px-4">
                    {Object.values(typingUsers).length > 0 && (
                        <p className="text-[11px] text-green-400 italic animate-pulse">
                            {Object.values(typingUsers).join(', ')} {Object.values(typingUsers).length > 1 ? 'are' : 'is'} typing...
                        </p>
                    )}
                </div>

            <ChatInput 
                socketRef={socketRef} 
                isAuthorized={isAuthorized} 
                questionId={questionId} 
                status={status} 
            />
        </div>
    );
};

export default DiscussionRoom;