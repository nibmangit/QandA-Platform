import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Edit, Calendar, Award, BookOpen, MessageSquare, ThumbsUp, ThumbsDown, MessageCircle, ChevronRight } from "lucide-react";
import { findUserById } from "../api/userServiece";
import apiPrivate from "../api/axiosPrivate"; 
import { useAuth } from "../context/AuthContext"; 
import GenerateBadgeIcon from "../Components/GenerateBadgeIcon";
import ProfileEditModal from "../Components/ProfileEditModal";
import LoadingPage from "./LoadingPage";
import { getProfile } from "../api/authService";
import { getAllBadges } from "../api/badgeService";

const UserProfilePage = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { userId } = useParams();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      let targetId = (userId && userId !== "undefined") ? userId : currentUser?.id;
      if (!targetId) return;
      try {
        let userData = targetId.toString() === currentUser?.id?.toString() 
          ? await getProfile() 
          : await findUserById(targetId);
        setProfileUser(userData);
      } catch (err) {
        console.error("User Fetch Error:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    if (!authLoading) fetchUser();
  }, [userId, currentUser, authLoading]);

  useEffect(() => {
    if (!profileUser) return;
    const fetchData = async () => {
      try {
        const [qRes, aRes, allBadges] = await Promise.allSettled([
          apiPrivate.get(`/questions/questions/?author=${profileUser.email}`),
          apiPrivate.get(`/questions/answers/?author=${profileUser.id}`),
          getAllBadges()
        ]);

        if (qRes.status === "fulfilled") {
          const qData = qRes.value.data.results || qRes.value.data;
          setUserQuestions(qData); // Keep full list for counts, slice later for display
        }
        if (aRes.status === "fulfilled") {
          const aData = aRes.value.data.results || aRes.value.data;
          setUserAnswers(aData); // Keep full list for counts, slice later for display
        }
        if (allBadges.status === "fulfilled") {
          const userBadgeIds = (profileUser.badges || []).map(b => typeof b === 'object' ? b.id : b);
          setUserBadges(allBadges.value.filter(b => userBadgeIds.includes(b.id)));
        }
      } catch (err) { console.error("Activity Error:", err); }
    };
    fetchData();
  }, [profileUser]);

  if (authLoading || isDataLoading || !profileUser) return <LoadingPage />;

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      
      {/* SECTION 1: Profile Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16" />
        <div className="relative flex flex-col items-center sm:flex-row sm:items-end sm:space-x-8">
          <div className="relative">
            <img
              src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.name}&background=4f06e5&color=fff`}
              className="h-32 w-32 rounded-3xl object-cover ring-4 ring-yellow-400 shadow-2xl"
              alt={profileUser.name}
            />
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="absolute -bottom-2 -right-2 bg-white dark:bg-[#1E293B] p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:text-yellow-500 transition-colors">
                <Edit size={18} />
              </button>
            )}
          </div>
          <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-1">
              {profileUser.role === "admin" ? "Faculty Moderator" : "Student Contributor"}
            </p>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{profileUser.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profileUser.date_joined).getFullYear()}</span>
              <span>•</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{profileUser.points} Reputation</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 text-center sm:text-left">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
            "{profileUser.bio || "This user hasn't written a bio yet."}"
          </p>
        </div>
      </div>

      {/* SECTION 2: Impact Grid (Stat Cards & Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <StatCard 
            icon={<BookOpen size={20}/>} 
            label="Questions" 
            value={userQuestions.length} 
            color="text-blue-500" 
          />
          <StatCard 
            icon={<MessageSquare size={20}/>} 
            label="Answers" 
            value={userAnswers.length} 
            color="text-green-500" 
          />
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Achievements</h3>
            <Award size={16} className="text-yellow-400" />
          </div>
          <div className="flex gap-3 flex-wrap">
            {userBadges.length > 0 ? (
              userBadges.map((badge) => (
                <div key={badge.id} className="group relative" title={badge.name}>
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:scale-110 transition-transform cursor-help">
                    <GenerateBadgeIcon icon={badge.icon} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No badges earned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Split Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* COLUMN: QUESTIONS */}
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-500 rounded-lg text-white"><BookOpen size={18}/></div>
            Recent Questions
          </h3>

          <div className="space-y-4">
            {userQuestions.length > 0 ? (
              userQuestions.slice(0, 4).map((q) => (
                <Link key={q.id} to={`/questions/${q.id}`} className="block group bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-all shadow-sm">
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1 mb-2">{q.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{q.body.replace(/<[^>]*>?/gm, '')}</p>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><ThumbsUp size={12}/> {q.likes_total || q.likes}</span>
                    <span className="flex items-center gap-1"><ThumbsDown size={12}/> {q.dislikes_total || q.dislikes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12}/> {q.answers_total || q.answers_count}</span>
                    <span className="ml-auto font-medium lowercase italic">{new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-10 text-center bg-gray-50 dark:bg-[#1E293B]/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 italic">No questions yet.</div>
            )}
          </div>
        </div>

        {/* COLUMN: ANSWERS */}
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-3 px-2">
            <div className="p-2 bg-green-500 rounded-lg text-white"><MessageSquare size={18}/></div>
            Recent Answers
          </h3>

          <div className="space-y-4">
            {userAnswers.length > 0 ? (
              userAnswers.slice(0, 4).map((ans) => (
                <div key={ans.id} className="bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded uppercase">Response to:</span>
                    <Link to={`/questions/${ans.question}`} className="text-[11px] font-bold text-gray-900 dark:text-white hover:underline truncate flex-1">
                      {ans.question_title || `Question #${ans.question}`}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 italic border-l-4 border-gray-100 dark:border-gray-800 pl-4 py-1">
                    "{ans.body.replace(/<[^>]*>?/gm, '')}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400">
                    <span className="flex items-center gap-1.5 text-green-500"><ThumbsUp size={12}/> {ans.likes}</span>
                    <span className="flex items-center gap-1.5 text-red-400"><ThumbsDown size={12}/> {ans.dislikes}</span>
                    <span className="flex items-center gap-1.5 text-blue-400"><MessageCircle size={12}/> {ans.comments_count || 0}</span>
                    <span className="ml-auto font-medium italic">{new Date(ans.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center bg-gray-50 dark:bg-[#1E293B]/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 italic">No answers yet.</div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <ProfileEditModal onClose={() => setIsEditing(false)} user={profileUser} />
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-black dark:text-white">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
    </div>
  </div>
);

export default UserProfilePage;