import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getNotifications, markAsRead, markAllRead, deleteNotification, deleteAllNotifications } from "../api/notificationService";
import { useAuth } from "./AuthContext"; 

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) { 
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setLoading(true);
      const data = await getNotifications(); 
      const fetchedNotis = data.results || [];
      setNotifications(fetchedNotis);
      setNextPageUrl(data.next);
      
      const unread = fetchedNotis.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

   const loadMoreNotifications = async () => {
    if (!nextPageUrl) return;
    try {
      setLoading(true);
      const data = await getNotifications(nextPageUrl);
      const fetchedNotis = data.results || [];
      setNotifications(prev => [...prev, ...fetchedNotis]);
      setNextPageUrl(data.next);
      
      const newUnread = fetchedNotis.filter(n => !n.read).length;
      setUnreadCount(prev => prev + newUnread);
    } catch (err) {
      console.error("Error loading more notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => { 
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) return;

    try { 
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Then tell the backend
      await markAsRead(id);
    } catch (err) {
      console.error("Failed to mark as read", err); 
      fetchNotifications(); 
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      await markAllRead();
    } catch (err) {
      console.error("Failed to mark all as read", err);
      fetchNotifications();
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      const target = notifications.find(n => n.id === id);
      // Update UI first
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (target && !target.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      } 
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification", err);
      fetchNotifications();
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return; 

    try {
      setNotifications([]);
      setUnreadCount(0);
      await deleteAllNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications", err);
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      setNotifications, 
      unreadCount, 
      loading, 
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteOne,
      handleDeleteAll,
      refresh: fetchNotifications,
      nextPageUrl, 
      loadMore: loadMoreNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);