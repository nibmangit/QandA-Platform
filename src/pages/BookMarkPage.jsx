import { useEffect, useState } from "react";
import { Bookmark, Search, BookOpen } from "lucide-react";
import { BDU } from "../utils/css"; 
import QuestionCard from "../Components/QuestionCard";
import apiPrivate from "../api/axiosPrivate";
import LoadingPage from "./LoadingPage";
import { useQuestionActions } from "../hooks/useQuestionActions";

function BookMarkPage() {
  const { questions, setQuestions, onLikeList, onBookmarkList, onDeleteList } = useQuestionActions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await apiPrivate.get('/questions/bookmarks/');
        console.log("Data: ", res.data) ;
        // map it to get the raw question objects
        const questionList = res.data.map(item => ({
          ...item.question,
          is_bookmarked: true 
        }));
        setQuestions(questionList);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);


  if (loading) return <LoadingPage message="Loading your bookmarks..." isFullPage={false} />;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center">
        <Bookmark size={32} className="mr-3 text-yellow-500 fill-yellow-500" /> 
        Your Bookmarks
      </h2>
      
      <div className="max-w-4xl">
        {questions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {questions.map(q => (
              <QuestionCard
                key={q.id} 
                question={q}
                onLike={(type, targetId, isLike) => onLikeList(type, targetId, isLike)}
                onBookmark={() => onBookmarkList(q.id, true)}
                onDelete={() => onDeleteList(q.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookMarkPage;


const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center space-y-6 transition-colors duration-500">
    <BookOpen size={64} style={{ color: BDU.GOLD }} className="opacity-70" />
    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      No Saved Questions Yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
      It looks like your notebook is empty! Find interesting questions on the platform and tap the bookmark icon to save them here.
    </p>
    <a href="#questions" className="flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-[1.03] shadow-md bg-[#003366]">
      <Search size={18} className="mr-2" />
      Explore Questions
    </a>
  </div>
);