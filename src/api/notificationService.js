import apiPrivate from "./axiosPrivate";

// 1. Fetch List (Supports Pagination)
export const getNotifications = async (url = null) => {
  const endpoint = url || '/notifications/list/';
  const response = await apiPrivate.get(endpoint);
  return response.data;
};

// 2. Mark One as Read
export const markAsRead = async (id) => {
  const response = await apiPrivate.patch(`/notifications/read/${id}/`);
  return response.data;
};

// 3. Mark All as Read
export const markAllRead = async () => {
  const response = await apiPrivate.post('/notifications/read-all/');
  return response.data;
};

// 4. Delete One Notification
export const deleteNotification = async (id) => {
  const response = await apiPrivate.delete(`/notifications/delete/${id}/`);
  return response.data;
};

// 5. Delete All Notifications (Clear History)
export const deleteAllNotifications = async () => {
  const response = await apiPrivate.delete('/notifications/delete-all/');
  return response.data;
};