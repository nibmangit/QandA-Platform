import { ThumbsUp, Bell, Mail, MessageSquare } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, text: `Your answer on "Deep Learning..." received 2 new likes.`, type: 'like', date: '5m ago' },
    { id: 2, text: `Admin posted a new announcement: Library System Upgrade.`, type: 'admin', date: '3h ago' },
    { id: 3, text: `You received a new message from Kebede Tilahun.`, type: 'message', date: '1d ago' },
    { id: 4, text: `The question "What is the required clearance distance..." has been marked as answered.`, type: 'answer', date: '2d ago' },
  ];

  const NotificationItem = ({ notif }) => {
    let Icon, iconColor, onClickAction;

    switch (notif.type) {
      case 'like':
        Icon = ThumbsUp;
        iconColor = 'text-yellow-500';
        onClickAction = () => navigate('/questions');
        break;
      case 'admin':
        Icon = Bell;
        iconColor = 'text-blue-600';
        onClickAction = () => navigate('/announcements');
        break;
      case 'message':
        Icon = Mail;
        iconColor = 'text-teal-500';
        onClickAction = () => navigate('/inbox');
        break;
      case 'answer':
      default:
        Icon = MessageSquare;
        iconColor = 'text-green-500';
        onClickAction = () => navigate('/questions');
        break;
    }

    return (
      <button
        onClick={onClickAction}
        className="w-full text-left flex items-start p-4 rounded-xl border-l-4 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#1E293B] dark:border-gray-700"
      >
        <Icon size={20} className={`shrink-0 mr-4 mt-1 ${iconColor}`} />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-gray-100">{notif.text}</p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{notif.date}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
        <Bell size={28} className="inline mr-2 text-blue-600 dark:text-blue-400" /> Notification History
      </h2>

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
        <button className="text-sm font-semibold hover:underline text-blue-600 dark:text-blue-400">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map(n => (
          <NotificationItem key={n.id} notif={n} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
