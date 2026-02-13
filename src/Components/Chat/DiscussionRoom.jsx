import React, { useState, useEffect, useRef, useCallback } from 'react';
import chatService from '../../api/chatService';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import ChatModeration from './ChatModeration';
import { useAuth } from '../../context/AuthContext';

const DiscussionRoom = ({ questionId }) => {
    const {currentUser} = useAuth();
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
            const wsUrl = `ws://127.0.0.1:8000/ws/chat/${questionId}/?token=${token}`;
            
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => setStatus('connected');
            
            socketRef.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log("LIVE SIGNAL RECEIVED:", data);
                
                switch(data.type) {
                    case 'new_message':
                        setMessages((prev) => {
                            if (prev.some(m => m.message_id === data.message_id)) return prev;
                            return [...prev, data];
                        });
                        break;

                    case 'delete_confirmation':
                        console.log("UI: Removing message ID", data.message_id);
                        setMessages((prev) => {
                            const filtered = prev.filter(m => String(m.message_id) !== String(data.message_id));
                            console.log("Messages after delete:", filtered.length);
                            return filtered;
                        });
                        break;

                    case 'edit_confirmation':
                        console.log("UI: Updating message ID", data.message_id);
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
                        console.log("Access update received:", data);
                        // Important: check if the update is for ME (the current user)
                        if (String(currentUser?.id) === String(data.target_user_id)) {
                            if (data.status === 'approved') {
                                setIsAuthorized(true);
                                alert("Your request to join has been approved!");
                            } else {
                                setIsAuthorized(false);
                                alert("Your request to join was declined.");
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
                        // data.users is an object: { "14": "fix_front", "15": "owner" }
                        // We convert it to an array for our state
                        var userArray = Object.entries(data.users).map(([id, name]) => ({
                                    user_id: id,
                                    username: name
                                }));
                        
                        console.log("Syncing online users:", userArray);
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
                        console.log(`Live Update: User ${data.user_id} caught up at ${data.timestamp}`);
                        if (String(data.user_id) !== String(currentUser?.id)) {
                            setOthersLastSeenTime(data.timestamp);
                        } else {
                            console.log("Ignoring my own broadcast");
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
            <div className="p-4 border rounded-lg bg-red-50 text-red-600 text-sm italic">
                You have been restricted from this discussion by the author.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3 bg-navy-900 flex justify-between items-center text-white">

                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Discussion Room</h3>
                </div>
                {/* Inside the Header div of DiscussionRoom.jsx */}
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 3).map(user => (
                        <div key={user.user_id} className="w-6 h-6 rounded-full bg-navy-700 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold" title={user.username}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {onlineUsers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-navy-900 flex items-center justify-center text-[10px]">
                            +{onlineUsers.length - 3}
                        </div>
                    )}
                </div>
                <span className="text-[10px] text-gray-300">{onlineUsers.length} online</span>
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
                        <p className="text-[11px] text-gray-400 italic animate-pulse">
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