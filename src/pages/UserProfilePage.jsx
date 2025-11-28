import { useState } from "react";
import { Edit, User, ThumbsUp, Zap, Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import { findUser, formatScore } from "../utils/Find";
import { MOCK_QUESTIONS, MOCK_ANSWERS, MOCK_BADGES } from "../utils/mock/mockData";
import QuestionCard from "../Components/QuestionCard";
import ProfileEditModal from "../Components/ProfileEditModal";
import { useAuth } from "../context/AuthContext";

const iconMap = {
  user: <User size={16} />,
  "thumbs-up": <ThumbsUp size={16} />,
  zap: <Zap size={16} />,
  shield: <Shield size={16} />,
};

const TabButton = ({ name, label, setActiveTab, activeTab }) => (
  <button
    onClick={() => setActiveTab(name)}
    className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-colors ${
      activeTab === name
        ? `border-b-4 border-yellow-400 text-[#003366] dark:text-[#E6C25F]`
        : "text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
    }`}
  >
    {label}
  </button>
);

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const profileUser = findUser(userId) || currentUser;
  const isCurrentUser = currentUser.id === profileUser.id;

  const userQuestions = MOCK_QUESTIONS.filter((q) => q.authorId === profileUser.id);
  const userAnsweredQuestionIds = [
    ...new Set(MOCK_ANSWERS.filter((a) => a.authorId === profileUser.id).map((a) => a.questionId)),
  ];
  const userAnswers = MOCK_QUESTIONS.filter((q) => userAnsweredQuestionIds.includes(q.id));

  const handleEditProfile = () => setIsEditing(true);

  const ReputationGraph = () => (
    <div className="w-full h-40 bg-gray-50 dark:bg-[#1E293B] rounded-xl p-4 flex items-center justify-center border border-gray-100 dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-300 italic text-sm">
        Reputation Graph Placeholder (Points over time)
      </p>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-100">
              {isCurrentUser ? profileUser.bio : "This user has hidden their bio."}
            </p>

            <h4 className="text-xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100">
              Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {isCurrentUser ? formatScore(profileUser.points) : "Hidden"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Reputation Points</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-yellow-500 dark:text-yellow-400">
                  {userQuestions?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Questions Asked</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-green-500 dark:text-green-400">
                  {userAnswers?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Answers Contributed</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-purple-500 dark:text-purple-400">
                  {isCurrentUser ? profileUser.badges?.length || 0 : "Hidden"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Badges Earned</p>
              </div>
            </div>

            {isCurrentUser && (
              <>
                <h4 className="text-xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100">
                  Activity Timeline
                </h4>
                <ReputationGraph />
              </>
            )}
          </div>
        );
      case "my-questions":
        return (
          <div className="space-y-4">
            {userQuestions.length > 0 ? (
              userQuestions.map((q) => <QuestionCard key={q.id} question={q} />)
            ) : (
              <p className="text-gray-500 dark:text-gray-300">
                This user has not asked any questions yet.
              </p>
            )}
          </div>
        );
      case "my-answers":
        return (
          <div className="space-y-4">
            {userAnswers.length > 0 ? (
              userAnswers.map((q) => <QuestionCard key={q.id} question={q} />)
            ) : (
              <p className="text-gray-500 dark:text-gray-300">
                This user has not contributed any answers yet.
              </p>
            )}
          </div>
        );
      case "reputation-history":
        if (!isCurrentUser) return null;
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl text-sm text-gray-800 dark:text-gray-100">
              <span className="font-semibold">+50</span> points for best answer (q-003)
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl text-sm text-gray-800 dark:text-gray-100">
              <span className="font-semibold">+10</span> points for 'Helpful' badge
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl text-sm text-gray-800 dark:text-gray-100">
              <span className="font-semibold">+2</span> points for question like (q-001)
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl text-sm text-gray-500 italic dark:text-gray-400">
              ...many more entries...
            </div>
          </div>
        );
      case "badges":
        if (!isCurrentUser) return null;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_BADGES.map((badge, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-full bg-yellow-300 text-[#003366]">
                    {iconMap[badge.icon]}
                  </span>
                  <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">{badge.name}</h5>
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{badge.description}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-[#0F172A] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <img
              src={
                profileUser.avatar
                  ? profileUser.avatar
                  : `https://placehold.co/100x100/CCDCDC/FFFFFF?text=${profileUser.name.charAt(0)}`
              }
              alt={profileUser.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-offset-2 ring-yellow-400"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {profileUser.name}
              </h1>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {profileUser.role === "admin" ? "Faculty Moderator" : "Student Contributor"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isCurrentUser ? profileUser.bio?.split(",")[0] : "Bio hidden"} | Joined:{" "}
                {new Date("2024-01-15").toLocaleDateString()}
              </p>
            </div>
            {isCurrentUser && (
              <button
                className="ml-auto px-4 py-2 text-sm font-semibold rounded-xl transition-all border border-gray-300 dark:text-blue-700 dark:border-gray-600 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-[#1E293B]"
                onClick={handleEditProfile}
              >
                <Edit size={16} className="inline mr-1" /> Edit Profile
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex space-x-3 overflow-x-auto">
              <TabButton name="overview" label="Overview" setActiveTab={setActiveTab} activeTab={activeTab} />
              {isCurrentUser && (
                <>
                  <TabButton name="my-questions" label="My Questions" setActiveTab={setActiveTab} activeTab={activeTab} />
                  <TabButton name="my-answers" label="My Answers" setActiveTab={setActiveTab} activeTab={activeTab} />
                  <TabButton name="reputation-history" label="Reputation History" setActiveTab={setActiveTab} activeTab={activeTab} />
                  <TabButton name="badges" label="Badges" setActiveTab={setActiveTab} activeTab={activeTab} />
                </>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            <TabContent />
          </div>
        </div>
      </div>

      {isEditing && (
        <ProfileEditModal onClose={() => setIsEditing(false)} user={profileUser} />
      )}
    </>
  );
};

export default UserProfilePage;
