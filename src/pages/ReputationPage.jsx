import { MOCK_BADGES, MOCK_USERS } from "../utils/mock/mockData";
import { Zap } from "lucide-react";
import { formatScore } from "../utils/Find";
import { useNavigate } from "react-router-dom";
import BadgeDisplay from "../Components/BadgeDisplay";
import { useTopUsers } from "../context/topUserContext";
  
const ReputationPage = () => {
  const navigate = useNavigate();
  const {topUsers} = useTopUsers();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        <Zap size={28} className="inline mr-2" /> Reputation & Badges
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A2A3A] dark:border-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 h-fit">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-yellow-500 dark:text-yellow-400 dark:border-slate-700">
            Leaderboard
          </h3>

          <div className="space-y-3">
            {topUsers?.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center p-3 rounded-xl ${
                  index < 3
                    ? "bg-yellow-50 dark:bg-yellow-900/20 shadow-sm"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`text-xl font-extrabold mr-3 ${
                    index === 0
                      ? "text-yellow-600"
                      : index === 1
                      ? "text-gray-500"
                      : index === 2
                      ? "text-amber-700"
                      : "text-gray-400 dark:text-slate-500"
                  }`}
                >
                  #{index + 1}
                </span>

                <img
                  src={user.avatar? user.avatar
                    : `https://placehold.co/100x100/4f06e5/ffffff?text=${user.name?.charAt(0).toUpperCase()}`
                  }
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover mr-3"
                />

                <div className="flex-1">
                  <p 
                  onClick={()=>{navigate(`/profile/${user.id}`)}}
                  className="font-semibold text-slate-700 dark:text-slate-200 hover:cursor-pointer">
                    {user.name}
                  </p>
                </div>

                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {formatScore(user.points)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Platform Badges
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_BADGES.map((badge, i) => (
              <BadgeDisplay
                key={i}
                badgeName={badge.name}
                icon={badge.icon}
                description={badge.description}
              />
            ))}

            {/* <BadgeDisplay
              badgeName="Top Answerer"
              icon={<MessageSquare size={16} />}
              description="Authored the most highly-voted answer in a month."
            />

            <BadgeDisplay
              badgeName="Veteran"
              icon={<Calendar size={16} />}
              description="Active on the platform for over one year."
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationPage;
