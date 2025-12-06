import QuestionCard from "./QuestionCard";
import GenerateBadgeIcon from "./GenerateBadgeIcon";
 



const ProfileTabContent = ({activeTab, isCurrentUser, profileUser, userQuestions, userAnswers, userBadges }) => {
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
                {profileUser.points}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Reputation Points</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
              <p className="text-3xl font-extrabold text-yellow-500 dark:text-yellow-400">
                {userQuestions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Questions Asked</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
              <p className="text-3xl font-extrabold text-green-500 dark:text-green-400">
                {userAnswers.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Answers Contributed</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-[#1A2A3A] rounded-xl shadow-sm text-center">
              <p className="text-3xl font-extrabold text-purple-500 dark:text-purple-400">
                {isCurrentUser ? profileUser.badges?.length : "Hidden"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Badges Earned</p>
            </div>
          </div>
        </div>
      );

    case "my-questions":
      return (
        <div className="space-y-4">
          {userQuestions.length > 0 ? (
            userQuestions.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No questions yet.</p>
          )}
        </div>
      );

    case "my-answers":
      return (
        <div className="space-y-4">
          {userAnswers.length > 0 ? (
            userAnswers.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No answers yet.</p>
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
            <span className="font-semibold">+10</span> points for "Helpful" badge
          </div>
        </div>
      );

    case "badges":
      if (!isCurrentUser) return null;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBadges.length > 0 ? (
            userBadges.map((badge, i) => (
            <div key={i} className="p-4 bg-white dark:bg-[#1E293B] rounded-xl shadow-md">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-full bg-yellow-300 text-[#003366]">
                  <GenerateBadgeIcon icon={badge.icon} />
                </span>
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {badge.name}
                </h5>
              </div>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{badge.description}</p>
            </div>
      ))) : (
        <p className="text-gray-500 dark:text-gray-300">
          You have no badges yet.
        </p>
      )}
        </div>
      );

    default:
      return null;
  }
};

export default ProfileTabContent;
