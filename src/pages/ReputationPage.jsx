import { Zap } from "lucide-react"; 
import BadgeDisplay from "../Components/BadgeDisplay"; 
import TopContributors from "../Components/TopContributors";
import { useEffect, useState } from "react";
import { getAllBadges } from "../api/badgeService";
import LoadingPage from "./LoadingPage";
  
const ReputationPage = () => { 
  const [loading , setLoading] = useState(true);
  const [badges, setBadges]= useState([])

  useEffect(() =>{
    const fetchBadges = async()=>{
      try{
        setLoading(true)
        const data = await getAllBadges();
        setBadges(data);
      }catch (err){
        console.error("Faild to fetch", err)
      }finally{
        setLoading(false);
      }
    }
    fetchBadges();
  },[])

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        <Zap size={28} className="inline mr-2" /> Reputation & Badges
      </h2>

     {loading? (<LoadingPage message="Loading reputation data ..." isFullPage={false} />):
     ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            {badges?.map((badge, i) => (
              <BadgeDisplay
                key={i}
                badgeName={badge.name}
                icon={badge.icon}
                description={badge.description}
              />
            ))} 
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default ReputationPage;
