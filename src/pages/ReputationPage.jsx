import { MOCK_BADGES } from "../utils/mock/mockData";
import { Zap } from "lucide-react"; 
import BadgeDisplay from "../Components/BadgeDisplay"; 
import TopContributors from "../Components/TopContributors";
  
const ReputationPage = () => { 

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
             <TopContributors limit={10} showButton={false} />
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
