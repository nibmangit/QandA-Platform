import { CornerUpRight, BookOpen, TrendingUp } from "lucide-react"; 
import AnnouncementBanner from "../Components/AnnouncementBanner"; 
import QuestionCard from "../Components/QuestionCard";
import { BDU, BDU_DARK } from "../utils/css";  
import { useNavigate } from "react-router-dom";  
import TopContributors from "../Components/TopContributors";
import { useQuestionActions } from "../hooks/useQuestionActions";
import { useEffect, useState } from "react";
import { getQuestions } from "../api/questionService";
import {getAnnouncements} from "../api/announcementService"
import LoadingPage from "./LoadingPage";
 

const LandingPage = () => {
  const navigate = useNavigate();
  const { questions, setQuestions, onLikeList, onBookmarkList, onDeleteList } = useQuestionActions(); 
  const [loading, setLoading] = useState(true);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchAnnouncement = async()=>{
      try{
        setLoading(true)
        const data = await getAnnouncements()
        setLatestNews(data.results.slice(0,3) || data.slice(0,3))
      }catch{
        console.error("Faild to fetch the announcement.")
      }finally{
        setLoading(false)
      }
    }
    fetchAnnouncement();
  },[])
  
  useEffect(()=>{
    const fetchTrending = async() =>{
    try{
      setLoading(true);
      const data = await getQuestions();
      const trending = data.results.sort((a,b)=>b.likes-a.likes).slice(0,4)
      setQuestions(trending);
    }catch{
      console.error("Faild to fetch trending questions.")
    }finally{
      setLoading(false);
    }
  }
  fetchTrending();
  },[setQuestions])

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

      <div className="mb-12 space-y-4">
        <h3 className={`text-2xl font-bold mb-4 text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`} >University Announcements</h3>
        {latestNews.map((ann, index ) => (
          <div
                key={ann.id}
                className={`p-5 rounded-xl shadow-sm border-l-4 transition-all hover:translate-x-1 cursor-pointer
                  ${index === 0? "border-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10" : "border-blue-500 bg-gray-50 dark:bg-[#0F172A]"}
                  `}
                onClick={() => navigate(`/announcements/${ann.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">
                    {ann.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(ann.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
                  {ann.body}
                </p>

                <div className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center">
                  Read Full Notice <span className="ml-1">→</span>
                </div>
              </div>
        ))}        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <TrendingUp size={24} className="mr-2 text-orange-500" /> Trending Questions
          </h3>

          {loading ? (
            <div className="space-y-4">
               <LoadingPage message="Loading Trending Questions.." isFullPage={false} />
            </div>
          ) : (
            <>
              {questions.map(q => (
                <QuestionCard 
                    key={q.id} 
                    question={q}  
                    onLike={(type, targetId, isLike) => onLikeList(type, targetId, isLike)}
                    onBookmark={() => onBookmarkList(q.id, false)}
                    onDelete={() => onDeleteList(q.id)}
                  />
              ))}
              
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate('/questions')}
                  className="text-sm font-semibold hover:underline text-blue-600 dark:text-blue-400"
                >
                  View All Questions →
                </button>
              </div> 
            </>
          )}
        </div>
 
        <div className="lg:col-span-1"> 
          <TopContributors limit={5} />
        </div>
      </div>
    </div>
  );
};
export default LandingPage;