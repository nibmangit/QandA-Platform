import apiPrivate from './axiosPrivate';

const chatService = {
    
    getChatHistory: (questionId, page = 1) => {
        return apiPrivate.get(`/chat/history/${questionId}/?page=${page}`);
    },
    
    requestWriteAccess: (questionId, reason) => {
        return apiPrivate.post(`/chat/request-write/${questionId}/`, { reason });
    },
    
    handleWriteRequest: (requestId, status) => {
        return apiPrivate.patch(`/chat/handle-request/${requestId}/`, { status });
    }, 

    deleteMessage: (messageId) => {
        return apiPrivate.delete(`/chat/message/${messageId}/`);
    }, 

    editMessage: (messageId, content) => {
        return apiPrivate.patch(`/chat/message/${messageId}/`, { content });
    },

    moderateUser: (questionId, userId, action) => {
        return apiPrivate.post(`/chat/ban-user/${questionId}/`, { 
            user_id: userId, 
            action: action 
        });
    }
};

export default chatService;