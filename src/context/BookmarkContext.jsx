import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiPrivate from '../api/axiosPrivate';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const { isLoggedIn } = useAuth();

  const fetchBookmarkCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try { 
      const response = await apiPrivate.get('/questions/bookmarks/'); 
      setBookmarkCount(response.data.count || response.data.length);
    } catch (err) {
      console.error("Failed to fetch bookmark count", err);
    }
  }, [isLoggedIn]); 

useEffect(()=> {
  fetchBookmarkCount();
}, [fetchBookmarkCount]);

  return (
    <BookmarkContext.Provider value={{ bookmarkCount, refreshBookmarks: fetchBookmarkCount }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);