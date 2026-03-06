import { PlusSquare, List, Mail, Settings, MessageSquare, ThumbsUp, Zap } from "lucide-react"; 
import { BDU } from "../utils/css";
import { formatScore } from "../utils/Find";
import QuestionCard from "../Components/QuestionCard";
import AnnouncementBanner from "../Components/AnnouncementBanner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import QuickAction from "../helper/QuickAction";
import { useNotifications } from "../context/NotificationContext";
import {getNotificationConfig, formatNotiDate} from "../helper/notificationHelper";
import { useEffect, useState } from "react"; 
import LoadingPage from "./LoadingPage";
import apiPrivate from "../api/axiosPrivate";
import { useQuestionActions } from "../hooks/useQuestionActions";
import { getAnnouncements } from "../api/announcementService";
import EmptyState from "../Components/EmptyState";

const Dashboard = () => {
  const {currentUser} = useAuth();
  const {notifications} = useNotifications();
  const navigate = useNavigate();
  const { questions, setQuestions, onLikeList, onDeleteList, onBookmarkList } = useQuestionActions([]);
  const [loading, setLoading] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        setLoading(true); 
         const response = await apiPrivate.get(`/questions/questions/?author=${currentUser.email}`);
        const data = response.data.results || response.data;
        setQuestions(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch user's questions", err);
      }finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, [currentUser.id, currentUser.email, setQuestions]);

  useEffect(() => {
    const fetchPinnedAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await getAnnouncements();
        const data = response.results || response;
        const pinned = data.find(ann => ann.is_pinned);
        if (pinned) {
          setLatestNews(pinned);
        } else {
          setLatestNews(data[0] || null);
        }
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPinnedAnnouncement();
  },[]);
  
  if (loading) return <LoadingPage message="Loading your dashboard..." isFullPage={false} />;
  return (
    <div className="max-w-7xl mx-auto py-10 px-4"> 
      <h2
        className="text-3xl font-extrabold mb-6 dark:text-gray-100 text-gray-900"
        style={{ letterSpacing: '0.5px' }}
      >
        Welcome, {currentUser.name}!
      </h2> 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction icon={PlusSquare} title="Ask Question" description="Start a new discussion." onClick={() => navigate('/ask-question')} />
        <QuickAction icon={List} title="My Questions" description="View your submission history." onClick={() => navigate(`/profile/${currentUser.id}`)} />
        <QuickAction icon={Mail} title="Messages" description="Check private conversations." onClick={() => navigate('/inbox')} />
        <QuickAction icon={Settings} title="Profile Settings" description="Manage account details." onClick={() => navigate(`/profile/${currentUser.id}`)} />
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
        <div className="lg:col-span-2 space-y-8"> 
          <div className="p-6 rounded-2xl shadow-xl border transition-colors border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0F172A]">
            <h3 className="text-xl font-bold mb-4 flex justify-between items-center dark:text-gray-100 text-gray-900">
              Notifications Feed
              <button
                onClick={() => navigate('/notifications')}
                className="text-sm font-medium hover:underline"
                style={{ color: BDU.ACCENT }}
              >
                View All
              </button>
            </h3>
            <div className="space-y-3">
            {notifications?.filter(n => !n.is_read).length > 0 ? (
            notifications?.filter(n => !n.is_read).slice(0, 3).map((n) => {
              const { Icon, color, bg } = getNotificationConfig(n.noti_type);

              return (
                <div
                  key={n.id}
                  onClick={()=>navigate('/notifications')}
                  className="flex items-start p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] hover:bg-white dark:hover:bg-[#2D3748] transition-colors group"
                >
                  {/* Icon with a subtle background circle */}
                  <div className={`p-2 rounded-lg ${bg} ${color} mr-3   shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm dark:text-gray-100 text-gray-900 leading-snug">
                      {n.message}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 block">
                      {formatNotiDate(n.created_at)}
                    </span>
                  </div>
                </div>
              );
            })):(
              <EmptyState
                title="All Caught Up!" 
                message="You have no unread notifications at the moment."
                showButton={false}
                icon={Zap} 
              />
            )}
          </div>
          </div>
 
          <div className="p-6 rounded-2xl shadow-xl border transition-colors border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0F172A]">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900">My Recent Questions</h3>
            <div className="space-y-4">
              {questions && questions.length > 0 ? (
              questions?.map(q => 
              <QuestionCard 
                      key={q.id} 
                      question={q}  
                      onLike={onLikeList}
                      onBookmark={() => onBookmarkList(q.id, false)}
                      onDelete={() => onDeleteList(q.id)}
                    />
              )):(
                <EmptyState
                    title="No Questions Yet" 
                    message="Your recent activity is empty. Why not start a discussion?"
                    buttonLabel="Ask a Question"
                    buttonLink="/ask-question"
                  />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8"> 
          <div className="p-6 rounded-2xl shadow-xl border transition-colors border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0F172A]">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900">
              My Reputation
            </h3>
            <p className="text-4xl font-extrabold mb-4" style={{ color: BDU.ACCENT }}>
              {formatScore(currentUser.points)} <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Points</span>
            </p>
            <h4 className="font-semibold mb-2 dark:text-gray-100 text-gray-900">Badges Earned:</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.badges?.map(badge => (
                <span
                  key={badge}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-gray-200 border border-blue-200 dark:border-gray-700"
                >
                  {badge}
                </span>
              ))}
            </div>
            <button
                onClick={() => navigate('/reputation')}
                className={`w-full text-sm hover:bg-gray-200 dark:hover:bg-[#4475c5]
              bg-gray-100 dark:bg-[#1867e6] boarder-[${BDU.ACCENT}]  font-semibold mt-3 p-2 rounded-xl border border-dashed hover:cursor-pointer transition-colors`}
                
              >
                View Leaderboard
              </button>
          </div>

          {/* Announcements */}
          <div className="p-6 rounded-2xl shadow-xl border transition-colors border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0F172A]">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900">
              Platform Updates
            </h3>
            <AnnouncementBanner announcement={latestNews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
