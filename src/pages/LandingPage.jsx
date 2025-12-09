import { CornerUpRight, TrendingUp, Clock, BookOpen } from "lucide-react"; 
import AnnouncementBanner from "../Components/AnnouncementBanner";
import ActivityFeedContent from "../Components/ActivityFeedContent";
import QuestionCard from "../Components/QuestionCard";
import { BDU, BDU_DARK } from "../utils/css";
import UserCard from "../Components/UserCard";
import { MOCK_QUESTIONS, MOCK_USERS,MOCK_ANSWERS,MOCK_ANNOUNCEMENTS } from "../utils/mock/mockData";
import { useNavigate } from "react-router-dom"; 
 

const LandingPage = () => {
  const navigate = useNavigate();
  const trendingQuestions = MOCK_QUESTIONS.sort((a, b) => b.likes - a.likes).slice(0, 4);
  const topStudents = MOCK_USERS.sort((a, b) => b.points - a.points).slice(0, 5);
  const latestActivity = [
    { type: 'question', user: 'Almaz Birtukan', title: trendingQuestions[0].title, id: trendingQuestions[0].id },
    { type: 'answer', user: 'Kebede Tilahun', title: MOCK_ANSWERS[0].body.slice(0, 30) + '...', id: MOCK_ANSWERS[0].questionId },
    { type: 'like', user: 'Sara Genet', title: 'liked an answer.', id: null },
  ];
 

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">   
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl mb-12">
    <div className="absolute inset-0 w-full h-full">
    
        <img
          key={"landing-hero-image"}
          src={"image.png"}
          className={`absolute w-full h-full object-cover transition-opacity duration-1200 ${
            "opacity-100" 
          }`}
        /> 

    {/* DARK LAYER FOR READABILITY */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
  </div>

  <div className="relative p-6 md:p-12 text-white z-10">
  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-poppins">
    Your Campus Knowledge Hub.
  </h2>

  <p className="text-base md:text-lg mb-6 opacity-80 font-roboto">
    Connect with BDU students and faculty. Ask, answer, and learn together.
  </p>

  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={() => navigate("/ask-question")}
      className="flex items-center justify-center px-4 py-3 md:px-6 md:py-3 text-lg md:text-xl font-bold rounded-xl shadow-md transition-transform transform cursor-pointer hover:scale-105"
      style={{ backgroundColor: BDU.GOLD, color: BDU.NAVY }}
    >
      Ask a Question
      <CornerUpRight size={20} className="inline ml-2" />
    </button>

    <button
      onClick={() => navigate("/questions")}
      className="flex items-center justify-center px-4 py-3 md:px-6 md:py-3 text-lg md:text-xl font-bold rounded-xl shadow-md transition-transform transform cursor-pointer hover:scale-105"
      style={{ backgroundColor: BDU.GOLD, color: BDU.NAVY }}
    >
      Browse Questions
      <BookOpen size={20} className="inline ml-2" />
    </button>
  </div>
</div>
</div>


      {/* Announcements Banner */}
      <div className="mb-12">
        <h3 className={`text-2xl font-bold mb-4 text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`} >University Announcements</h3>
        <AnnouncementBanner announcement={MOCK_ANNOUNCEMENTS[0]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Trending Questions) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className={`text-2xl font-bold color-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`}>Trending Questions</h3>
          {trendingQuestions.map(q => <QuestionCard key={q.id} question={q} />)}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/questions')}
              className={`text-sm font-semibold hover:underline hover:cursor-pointer transition-colors`}
              style={{ color: BDU.ACCENT }}
            >
              View All Questions →
            </button>
          </div>

          {/* Latest Activity Feed (Mobile) */}
          <div className={`lg:hidden mt-8 `}>
            <h3 className={`text-2xl font-bold mb-4 text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`}>Latest Activity</h3>
            <ActivityFeedContent activities={latestActivity} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Top Students */}
          <div className={`bg-white dark:bg-[${BDU_DARK.BG}] p-6 rounded-2xl shadow-xl border border-gray-100`}>
            <h4 className={`text-xl text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}] font-bold mb-4 flex items-center`}>
              <TrendingUp size={20} className="mr-2" /> Top Students
            </h4>
            <div className={`space-y-3  `}>
              {topStudents.map(user => <UserCard key={user.id} user={user}/>)}
              <button
                onClick={() => navigate('/reputation')}
                className={`w-full text-sm hover:bg-gray-200 dark:hover:bg-[#4475c5]
              bg-gray-100 dark:bg-[#1867e6] boarder-[${BDU.ACCENT}]  font-semibold mt-3 p-2 rounded-xl border border-dashed hover:cursor-pointer transition-colors`}
                
              >
                View Leaderboard
              </button>
            </div>
          </div>

          {/* Latest Activity Feed (Desktop) */}
          <div className={`hidden lg:block bg-white dark:bg-[${BDU_DARK.BG}] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-black-100`}>
            <h4 className={`text-xl font-bold mb-4 flex items-center text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>
              <Clock size={20} className="mr-2" /> Latest Activity
            </h4>
            <ActivityFeedContent activities={latestActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;