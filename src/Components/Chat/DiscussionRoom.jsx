import React, { useState, useEffect, useRef } from 'react';
import chatService from '../../api/chatService';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import ChatModeration from './ChatModeration';

const DiscussionRoom = ({ questionId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isBanned, setIsBanned] = useState(false);
    const [isOwnerState, setIsOwnerState] = useState(false); 
    const [status, setStatus] = useState('connecting'); 
    const socketRef = useRef(null);

    useEffect(() => {
        if (!questionId) return;

        const loadHistory = async () => {
            try {
                const response = await chatService.getChatHistory(questionId);
                const history = [...response.data.results].reverse();
                setMessages(history);
                
                setIsAuthorized(response.data.user_can_write);
                setIsOwnerState(response.data.is_owner);
                setIsBanned(response.data.is_banned || false);
                
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
                {isOwnerState && <ChatModeration questionId={questionId} />}
            </div>

            <ChatBox messages={messages} currentUser={currentUser} isOwner={isOwnerState} socketRef={socketRef} />

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