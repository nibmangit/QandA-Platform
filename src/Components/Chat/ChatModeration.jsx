import React, { useState, useEffect } from 'react';
import chatService from '../../api/chatService';
import apiPrivate from '../../api/axiosPrivate';

const ChatModeration = ({ questionId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Using a relative path to respect axiosPrivate baseURL
            // Removed leading slash to prevent URL doubling
            const res = await apiPrivate.get(`chat/requests/${questionId}/`);
            setRequests(res.data);
        } catch (err) {
            console.error("Could not load requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (isOpen && questionId) fetchRequests();
    }, [isOpen, questionId]);

    const handleAction = async (requestId, status) => {
        try {
            // This calls chatService.patch(`chat/handle-request/${requestId}/`, { status })
            await chatService.handleWriteRequest(requestId, status);
            
            // Remove the processed user from the local list immediately
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            console.error("Action failed", err);
            alert("Failed to process request.");
        }
    };

    return (
        <div className="relative">
            {/* Moderation Shield/Settings Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-navy-800 rounded-full transition-all relative group"
                title="Moderation Tools"
            >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                
                {/* Red Notification Dot for pending requests */}
                {requests.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Background overlay to close on click-outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl z-20 overflow-hidden ring-1 ring-black ring-opacity-5">
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                Pending Write Requests
                            </h4>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="p-6 text-center text-xs text-gray-400 animate-pulse">Loading...</div>
                            ) : requests.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-400 italic">
                                    No pending requests
                                </div>
                            ) : (
                                requests.map(req => (
                                    <div key={req.id} className="p-3 border-b border-gray-50 dark:border-gray-700 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-750/50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold dark:text-white truncate max-w-[120px]">
                                                    {req.username}
                                                </span>
                                                <span className="text-[9px] text-gray-400 uppercase tracking-tighter">Requester</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button 
                                                    onClick={() => handleAction(req.id, 'accepted')}
                                                    className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded shadow-sm transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'rejected')}
                                                    className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] rounded"
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                        {req.reason && (
                                            <div className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-800">
                                                "{req.reason}"
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatModeration;