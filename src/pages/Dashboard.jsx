// import { useState } from "react";
import { PlusSquare, List, Mail, Settings, MessageSquare, ThumbsUp, Zap } from "lucide-react";
import { MOCK_ANNOUNCEMENTS, MOCK_QUESTIONS } from "../utils/mock/mockData";
import { BDU, BDU_DARK } from "../utils/css";
import { formatScore } from "../utils/Find";
import QuestionCard from "../Components/QuestionCard";
import AnnouncementBanner from "../Components/AnnouncementBanner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import QuickAction from "../helper/QuickAction";

const Dashboard = () => {
  const {currentUser} = useAuth();
  const navigate = useNavigate();
  const recentQuestions = MOCK_QUESTIONS.filter(q => q.authorId === currentUser.id).slice(0, 3);
  const notifications = [
    { id: 1, text: `Your question "${recentQuestions[0]?.title || 'DL vs RL'}" received 3 new answers.`, type: 'answer', date: '2h ago' },
    { id: 2, text: `User Kebede Tilahun liked your recent answer.`, type: 'like', date: '5h ago' },
    { id: 3, text: 'You earned a new badge: Helpful Student!', type: 'badge', date: '1d ago' },
  ];



  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Welcome */}
      <h2
        className="text-3xl font-extrabold mb-6 dark:text-gray-100 text-gray-900"
        style={{ letterSpacing: '0.5px' }}
      >
        Welcome, {currentUser.name}!
      </h2>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction icon={PlusSquare} title="Ask Question" description="Start a new discussion." onClick={() => navigate('/ask-question')} />
        <QuickAction icon={List} title="My Questions" description="View your submission history." onClick={() => navigate(`/profile/${currentUser.id}`)} />
        <QuickAction icon={Mail} title="Messages" description="Check private conversations." onClick={() => navigate('/inbox')} />
        <QuickAction icon={Settings} title="Profile Settings" description="Manage account details." onClick={() => navigate(`/profile/${currentUser.id}`)} />
      </div>

      {/* Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notifications Feed */}
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
              {notifications?.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B]"
                >
                  {n.type === 'answer' && <MessageSquare size={18} className="text-green-500 mr-3 mt-1" />}
                  {n.type === 'like' && <ThumbsUp size={18} className="text-yellow-500 mr-3 mt-1" />}
                  {n.type === 'badge' && <Zap size={18} className="text-purple-500 mr-3 mt-1" />}
                  <div>
                    <p className="text-sm dark:text-gray-100 text-gray-900">{n.text}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-400">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Recent Questions */}
          <div className="p-6 rounded-2xl shadow-xl border transition-colors border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0F172A]">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900">My Recent Questions</h3>
            <div className="space-y-4">
              {recentQuestions?.map(q => <QuestionCard key={q.id} question={q}/>)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Reputation & Badges */}
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
            <AnnouncementBanner announcement={MOCK_ANNOUNCEMENTS[1]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
