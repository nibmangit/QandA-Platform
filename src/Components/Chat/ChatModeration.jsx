import React, { useState, useEffect } from 'react';
import chatService from '../../api/chatService';
import apiPrivate from '../../api/axiosPrivate';
import { useFeedback } from '../../context/FeedbackContext';
import { Shield, UserPlus, UserX, Loader2 } from 'lucide-react';

const ChatModeration = ({ questionId, socketRef }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { showToast, askConfirmation } = useFeedback();
    const [activeTab, setActiveTab] = useState('requests'); // New: 'requests' or 'banned'
    const [requests, setRequests] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try { 
            const res = await apiPrivate.get(`chat/requests/${questionId}/`); 
            setRequests(res.data);
        } catch (err) {
            console.error("Could not load requests", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBannedUsers = async () => {
        setLoading(true);
        try {
            const res = await apiPrivate.get(`chat/banned-users/${questionId}/`);
            setBannedUsers(res.data);
        } catch (err) { 
            console.error("Could not load banned list", err); 
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => { 
        if (isOpen) {
            activeTab === 'requests'? fetchRequests():fetchBannedUsers(); 
        }
    }, [isOpen, activeTab, questionId]);

    useEffect(() => { 
        const socket = socketRef?.current;
        if(!socket) return;

        const handleMessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'new_access_request') { 
                fetchRequests(); 
                showToast(`New access request from ${data.username}`, 'info');
            }
        };
        socket.addEventListener('message', handleMessage);
        return () => socket.removeEventListener('message', handleMessage);
    }, [socketRef]);

    const handleAction = async (requestId, status, userId, username) => {
        try {
            await chatService.handleWriteRequest(requestId, status);
            if (socketRef.current) {
                socketRef.current.send(JSON.stringify({
                    type: 'update_request_status',
                    user_id: userId,
                    status: status === 'accepted' ? 'approved' : 'rejected'
                }));
            }
            setRequests(prev => prev.filter(r => r.id !== requestId));
            showToast(`${username}'s request ${status}`, status === 'accepted' ? 'success' : 'error');
        } catch (err) {
            console.error("Action failed", err);
            showToast("Failed to process request.", "error");
        }
    };

    const handleUnban = async (userId, username) => {
        const confirmed = await askConfirmation({
            title: "Lift Restriction?",
            message: `Are you sure you want to unban ${username}? they will be able to join the conversation immediately.`,
            confirmText: "Unban User",
            danger: false // This is a "safe" action
        });
        if (confirmed && socketRef.current) {
            socketRef.current.send(JSON.stringify({
                type: 'unban_user',
                user_id: userId
            }));
            setBannedUsers(prev => prev.filter(u => u.user_id !== userId));
            showToast(`${username} unbanned`, "success");
        }
    };

    return (
        <div className="relative">
            {/* Moderation Shield Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-navy-800 rounded-full transition-all relative group"
                title="Moderation Tools"
            >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                
                {requests.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl z-20 overflow-hidden ring-1 ring-black ring-opacity-5">
                        
                        {/* TAB NAVIGATION */}
                        <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <button 
                                onClick={() => setActiveTab('requests')}
                                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Requests ({requests.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('banned')}
                                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'banned' ? 'text-red-600 border-b-2 border-red-600 bg-white dark:bg-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Banned ({bannedUsers.length})
                            </button>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center gap-2 text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-[10px] font-bold uppercase">Fetching...</span>
                                </div>
                            ) : activeTab === 'requests' ? (
                                /* REQUESTS TAB */
                                requests.length === 0 ? (
                                    <div className="p-10 text-center text-xs text-gray-400 italic">No pending requests</div>
                                ) : (
                                    requests.map(req => (
                                        <div key={req.id} className="p-3 border-b border-gray-50 dark:border-gray-700 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700 dark:text-white truncate max-w-[120px]">{req.username}</span>
                                                    <span className="text-[9px] text-gray-400 uppercase tracking-tighter">Requester</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <button onClick={() => handleAction(req.id, 'accepted', req.user, req.username)} className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded shadow-sm transition-colors cursor-pointer">Accept</button>
                                                    <button onClick={() => handleAction(req.id, 'rejected', req.user, req.username)} className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] rounded cursor-pointer">Deny</button>
                                                </div>
                                            </div>
                                            {req.reason && (
                                                <div className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-800">
                                                    "{req.reason}"
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )
                            ) : (
                                /* BANNED TAB */
                                bannedUsers.length === 0 ? (
                                    <div className="p-10 text-center text-xs text-gray-400 italic">No banned users</div>
                                ) : (
                                    bannedUsers.map(user => (
                                        <div key={user.user_id} className="p-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700 dark:text-white">{user.username}</span>
                                                <span className="text-[9px] text-red-500 font-bold uppercase">Restricted</span>
                                            </div>
                                            <button 
                                                onClick={() => handleUnban(user.user_id, user.username)}
                                                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 text-[10px] font-bold rounded hover:bg-green-600 hover:text-white hover:border-green-600 transition-all cursor-pointer shadow-sm"
                                            >
                                                UNBAN
                                            </button>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatModeration;