import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useAuth } from '../../context/AuthContext';

const ChatBox = ({ messages, isOwner, socketRef, lastSeenTime, othersLastSeenTime, markAsRead }) => {
    const {currentUser} = useAuth()
    const scrollContainerRef = useRef(null);
    const lastReadMarkerRef = useRef(null);
    const hasInitialScrolled = useRef(false);
    const [isReady, setIsReady] = React.useState(false);

useEffect(() => {
        if (messages.length > 0 && !hasInitialScrolled.current) {
            setTimeout(() => {
                if (lastReadMarkerRef.current) {
                    lastReadMarkerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
                } else if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
                
                hasInitialScrolled.current = true;
                setIsReady(true); // Now reveal the chat
                markAsRead();
            }, 50);
        }
    }, [messages.length, markAsRead]);

    useEffect(() => {
        if (hasInitialScrolled.current && scrollContainerRef.current) {
            const el = scrollContainerRef.current;
            const isNearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 200;
            
            if (isNearBottom) {
                el.scrollTop = el.scrollHeight;
                // Only tell the server we read it if the last message came from someone else
                const lastMsg = messages[messages.length - 1];
                const isNotMe = lastMsg && String(lastMsg.user_id) !== String(currentUser?.id);
                
                if (isNotMe) {
                    markAsRead();
                }
            }
            }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length,currentUser?.id, markAsRead]);

 
    const formatDateSeparator = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    };

    return (
        <div 
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50 scrollbar-thin transition-opacity duration-300 ${
                isReady ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 mb-2">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Start the discussion...
                    </p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    // IDENTITY CHECK
                    const isMe = 
                        (msg.user_id && String(msg.user_id) === String(currentUser?.id)) || 
                        (msg.username && msg.username === currentUser?.username) ||
                        (msg.username && msg.username === currentUser?.email);
                    
                    //New SEEN LOGIC
                    const msgTime = new Date(msg.timestamp).getTime();
                    const othersTime = othersLastSeenTime ? new Date(othersLastSeenTime).getTime() : 0;
                    const hasBeenSeenByOthers = isMe && othersTime >= msgTime;

                    const isNewToMe = lastSeenTime && new Date(msg.timestamp) > new Date(lastSeenTime);
                    const isFirstNew = isNewToMe && (index === 0 || new Date(messages[index-1].timestamp) <= new Date(lastSeenTime));
                    // DATE SEPARATOR LOGIC
                    const currentDate = new Date(msg.timestamp).toDateString();
                    const previousDate = index > 0 
                        ? new Date(messages[index - 1].timestamp).toDateString() 
                        : null;
                    const showDateSeparator = currentDate !== previousDate;

                    const isSameUserAsPrevious = index > 0 && messages[index - 1].user_id === msg.user_id;
                    const isGrouped = isSameUserAsPrevious && !showDateSeparator

                    return (
                        <React.Fragment key={msg.message_id || `temp-${index}`}>
                            {showDateSeparator && (
                                <div className="flex items-center my-6">
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                    <span className="px-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                                        {formatDateSeparator(msg.timestamp)}
                                    </span>
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                            )}

                            {isFirstNew && !isMe && (
                                <div ref={lastReadMarkerRef} className="flex items-center my-4">
                                    <div className="flex-grow border-t border-red-400 opacity-50"></div>
                                    <span className="px-3 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                        New Messages Since Last Visit
                                    </span>
                                    <div className="flex-grow border-t border-red-400 opacity-50"></div>
                                </div>
                            )}
                            
                            <MessageBubble 
                                msg={msg} 
                                isMe={isMe}
                                isRoomOwner={isOwner}
                                socketRef={socketRef}
                                isGrouped={isGrouped}
                                isSeen={hasBeenSeenByOthers}
                            />
                        </React.Fragment>
                    );
                })
            )}
             
        </div>
    );
};

export default ChatBox;