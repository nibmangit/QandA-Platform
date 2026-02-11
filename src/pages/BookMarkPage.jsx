import { useEffect, useState } from "react";
import { Bookmark, Search, BookOpen } from "lucide-react";
import { BDU } from "../utils/css"; 
import QuestionCard from "../Components/QuestionCard";
import apiPrivate from "../api/axiosPrivate";
import LoadingPage from "./LoadingPage";
import { useQuestionActions } from "../hooks/useQuestionActions";
import EmptyState from "../Components/EmptyState";

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
  }, [setQuestions]);


  if (loading) return <LoadingPage message="Loading your bookmarks..." isFullPage={false} />;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center">
        <Bookmark size={32} className="mr-3 text-yellow-500 fill-yellow-500" /> 
        Your Bookmarks
      </h2>
      
      <div className="max-w-4xl">
        {questions.length === 0 ? (
          <EmptyState
              icon={Bookmark}
              title="Your Notebook is Empty" 
              message="Find interesting questions and answers on the platform and tap the bookmark icon to save them for later."
              buttonLabel="Explore Questions"
              buttonLink="/questions" 
            />
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