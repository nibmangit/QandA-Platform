import { TrendingUp, Trophy, Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTopUsers } from "../context/topUserContext";
import AuthorDisplay from "./AuthorDisplay";

const getRankDecoration = (index) => {
    if (index === 0) return { icon: <Trophy size={14} />, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" };
    if (index === 1) return { icon: <Medal size={14} />, color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/20" };
    if (index === 2) return { icon: <Medal size={14} />, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" };
    return { icon: null, color: "text-gray-400", bg: "" };
};

const TopContributors = ({ limit = 5, showButton = true }) => {
  const { topUsers } = useTopUsers();
  const navigate = useNavigate();
 
  return (
    <div className="bg-white dark:bg-[#1A2A3A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <h4 className="text-xl font-bold mb-4 flex items-center text-slate-800 dark:text-white">
        <TrendingUp size={20} className="mr-2 text-blue-500" /> Top Students
      </h4>

<div className="space-y-5">
        {topUsers?.slice(0, limit).map((user, index) => {
          const rank = getRankDecoration(index);
          return (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${rank.bg} ${rank.color}`}>
                  {rank.icon || index + 1}
                </div>
                
                {/* Reusing AuthorDisplay! */}
                <AuthorDisplay 
                  email={user.email} 
                  initialUser={user} // CRITICAL: This stops extra API calls
                  label="" 
                  size="sm" 
                />
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {user.points || 0}
                </span>
                <p className="text-[8px] uppercase font-bold text-gray-400 tracking-tighter">Points</p>
              </div>
            </div>
          );
        })}

        {showButton && 
        <button
          onClick={() => navigate('/reputation')}
          className="w-full text-xs font-bold mt-2 py-3 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all cursor-pointer"
        >
          View Full Leaderboard
        </button>}
      </div>
    </div>
  );
};

export default TopContributors;