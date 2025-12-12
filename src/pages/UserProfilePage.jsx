import { useState } from "react";
import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { findUser } from "../utils/Find";
import { MOCK_QUESTIONS, MOCK_ANSWERS} from "../utils/mock/mockData"; 
import ProfileEditModal from "../Components/ProfileEditModal";
import { useAuth } from "../context/AuthContext"; 
import ProfileTabContent from "../Components/ProfielTabContent";
import { getUserBadges } from "../helper/getUserBadges";


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
  const userBadges = getUserBadges(profileUser);
  const handleEditProfile = () => setIsEditing(true);


  return (
    <>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-[#0F172A] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <img
              src={
                profileUser.avatar
                  ? profileUser.avatar
                  : `https://placehold.co/100x100/CCDCDC/FFFFFF?text=${profileUser.name.charAt(0).toUpperCase()}`
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
 
          <div className="mt-8">
            <ProfileTabContent 
              activeTab={activeTab}
              isCurrentUser={isCurrentUser}
              profileUser={profileUser}
              userQuestions={userQuestions}
              userBadges={userBadges} 
              userAnswers={userAnswers} 
            />
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
