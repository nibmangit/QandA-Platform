import { useState } from "react";
import { Bell, Trash2, Check, CheckCheck, Inbox, RefreshCcw } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { getNotificationConfig, formatNotiDate } from "../helper/notificationHelper";
import LoadingPage from "./LoadingPage";
import DeleteModal from "../Components/DeleteModal";
import { useAuth } from "../context/AuthContext";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {currentUser} = useAuth();
  const { notifications, loading, handleMarkAsRead, handleMarkAllAsRead, 
          handleDeleteOne, handleDeleteAll, refresh, unreadCount,
          loadMore, nextPageUrl} = useNotifications();

  const [filter, setFilter] = useState('unread');
  const [loadingMore, setLoadingMore] = useState(false);
  
  // State for the Delete Modal
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, targetId: null });

  const displayNotifications = filter === 'all' ? notifications : notifications.filter(n => !n.read);
  const handleLoadMore = async () => {
  setLoadingMore(true);
  await loadMore();
  setLoadingMore(false);
}; 

  const handleConfirmDelete = () => {
    if (modalConfig.type === 'all') {
      handleDeleteAll();
    } else {
      handleDeleteOne(modalConfig.targetId);
    }
    setModalConfig({ isOpen: false, type: null, targetId: null });
  };

  const handleNavigate = (n) => {
  const type = n.noti_type.toLowerCase();
   
  if (!n.read) handleMarkAsRead(n.id);

  switch (type) {
    case 'message':
      navigate('/inbox');
      break;
    case 'announcement':
      navigate('/announcements');
      break;
    case 'badge':
      navigate(`/profile/${currentUser.id}/`);
      break;
    case 'comment':
    case 'like':
    case 'dislike':
    case 'answer':
    default: 
      navigate(`/questions/${n.related_object_id}`);
      break;
  }
};

  if (loading ) return <LoadingPage message="Loading Notifications..." isFullPage={false} />;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen"> 
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
        <h2 className="text-3xl font-black dark:text-white flex items-center">
          <Bell size={32} className="mr-3 text-blue-600" /> Notifications
        </h2>
        {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg shadow-blue-200 animate-pulse">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {['all', 'unread'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${filter === t ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-800">
        <div className="flex gap-4">
          <button onClick={handleMarkAllAsRead} className="text-sm font-bold flex items-center gap-1.5 text-blue-600 hover:opacity-80 transition-opacity cursor-pointer">
            <CheckCheck size={18} /> Mark all as read
          </button>
          <button 
            onClick={() => setModalConfig({ isOpen: true, type: 'all', targetId: null })}
            className="text-sm font-bold flex items-center gap-1.5 text-red-500 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Trash2 size={18} /> Clear all
          </button>
        </div>
        <button onClick={refresh} className="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <RefreshCcw size={20} className="hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {displayNotifications.length > 0 ? (
          <> 
            {displayNotifications.map((n) => {
              const { Icon, color, border } = getNotificationConfig(n.noti_type);
              return (
                <div 
                  key={n.id} 
                  className={`flex flex-col md:flex-row md:items-center p-4 rounded-2xl border transition-all bg-white dark:bg-[#1A2A3A] 
                    ${n.read ? 'border-gray-100 dark:border-gray-800 opacity-80' : `border-l-4 ${border} bg-blue-50/20 dark:bg-blue-900/10 shadow-sm`}`}
                >
                  <div className="flex-1 flex gap-4 items-start md:items-center">
                    <Icon size={24} className={`${color} shrink-0`} />
                    <div className="flex-1 cursor-pointer" onClick={() => handleNavigate(n)}>
                      <p className={`text-sm md:text-base ${n.read ? 'text-gray-600 dark:text-gray-400' : 'font-bold dark:text-white'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                        {formatNotiDate(n.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Status Text (Desktop Only) + Icons (Mobile & Desktop) */}
                  <div className="flex items-center justify-end gap-3 mt-4 md:mt-0 ml-0 md:ml-4 border-t md:border-t-0 pt-3 md:pt-0 dark:border-gray-800">
                    {!n.read ? (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Check size={16} />
                        <span className="hidden md:inline text-xs font-black uppercase">Mark Read</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400">
                        <CheckCheck size={16} className="text-green-500" />
                        <span className="hidden md:inline text-xs font-black uppercase">Read</span>
                      </div>
                    )}

                    <button 
                      onClick={() => setModalConfig({ isOpen: true, type: 'one', targetId: n.id })}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
 
            {nextPageUrl && (
              <div className="flex justify-center pt-6 pb-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group flex items-center cursor-pointer gap-2 px-8 py-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? (
                    <RefreshCcw size={18} className="animate-spin text-blue-600" />
                  ) : (
                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  <span>{loadingMore ? "Fetching..." : "View Older Notifications"}</span>
                </button>
              </div>
            )}
          </>
        ) : ( 
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Inbox size={48} className="mx-auto text-gray-300 mb-4 opacity-30" />
            <p className="text-gray-500 font-medium">No {filter === 'unread' ? 'unread ' : ''}notifications found.</p>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: null, targetId: null })}
        onConfirm={handleConfirmDelete}
        title={modalConfig.type === 'all' ? "Clear All History" : "Delete Notification"}
        message={modalConfig.type === 'all' 
          ? "Are you sure you want to remove all notifications? This action cannot be undone." 
          : "Are you sure you want to delete this notification?"}
      />
    </div>
  );
};

export default NotificationsPage;