import { useState, useMemo, useEffect } from "react";
import { List, ChevronLeft, ChevronRight } from "lucide-react";  // Added Chevrons for pagination
import QuestionCard from "../Components/QuestionCard";
import UserCard from "../Components/UserCard";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../Components/Search";
import { useQuestions } from "../context/QuestionContext";
import { useTopUsers } from "../context/topUserContext";
import { getCategories, getQuestions, deleteQuestion } from "../api/questionService";
import apiPrivate from "../api/axiosPrivate";
import { getCategoryEmoji } from "../helper/categoryIcons";
import LoadingPage from "./LoadingPage"; 

const SortButton = ({ label, value, sortBy, setSortBy }) => (
  <a
    onClick={() => setSortBy(value)}
    className={`px-3 py-1 text-sm font-semibold hover:cursor-pointer rounded-xl transition-colors
      ${sortBy === value ? `text-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm underline` : `text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}`}
  >
    {label}
  </a> 
);

const AllQuestionsPage = () => {
  const navigate = useNavigate();
  const { topUsers } = useTopUsers();
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(null); 
  const { searchText } = useQuestions();
  const location = useLocation();
  const tagFilter = location.state?.filterTag || null;
  const categoryFilter = location.state?.filterCategory || null;
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: Pagination State ---
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
 
  // Modified to accept an optional URL for pagination
  const fetchAll = async (url = null) => {
    try {
      setLoading(true);
      // If url is passed (from pagination buttons), use it, otherwise use default
      const [catData, questionData] = await Promise.all([
        getCategories(), 
        url ? getQuestions({ url }) : getQuestions()
      ]);
      setCategories(catData);
      setQuestions(questionData.results);
      setNextUrl(questionData.next);
      setPrevUrl(questionData.previous);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);
 
  const onLikeList = async (type, id, isLike) => {
    try {
      const resp = await apiPrivate.post(`/questions/questions/${id}/like-toggle/`, { 
        is_like: isLike 
      });
       
      setQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, likes: resp.data.likes, dislikes: resp.data.dislikes } : q
      ));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const onBookmarkList = async (id) => {
    try {
      await apiPrivate.post(`/questions/questions/${id}/bookmark/`);
      setQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, is_bookmarked: !q.is_bookmarked } : q
      ));
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  const onDeleteList = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredQuestions = useMemo(() => {
    let list = [...questions];
    if (categoryFilter) list = list.filter(q => String(q.category) === String(categoryFilter));
    if (filterCategory) list = list.filter(q => String(q.category) === String(filterCategory));
    if (tagFilter) list = list.filter(q => q.tags.includes(tagFilter));
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(item => item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "most-liked": return list.sort((a, b) => b.likes - a.likes);
      case "most-answered": return list.sort((a, b) => b.answers_count - a.answers_count);
      default: return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }, [sortBy, categoryFilter, filterCategory, searchText, questions, tagFilter]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Search />
      <h2 className="text-3xl font-bold mb-6 dark:text-white flex items-center">
        <List size={28} className="mr-2" /> All Community Questions
      </h2>

      {loading ? <LoadingPage message="Loading Questions..." isFullPage={false} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {filteredQuestions.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#1A2A3A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold px-2 text-gray-500">Sort:</span>
                <SortButton label="Newest" value="newest" sortBy={sortBy} setSortBy={setSortBy} />
                <SortButton label="Likes" value="most-liked" sortBy={sortBy} setSortBy={setSortBy} />
                <SortButton label="Answers" value="most-answered" sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            )}

            {filteredQuestions.length > 0 ? (
              <>
                {filteredQuestions.map(q => (
                  <QuestionCard 
                    key={q.id} 
                    question={q} 
                    // FIXED: Corrected arguments to match QuestionCard's call
                    onLike={(type, targetId, isLike) => onLikeList(type, targetId, isLike)}
                    onBookmark={() => onBookmarkList(q.id)}
                    onDelete={() => onDeleteList(q.id)}
                  />
                ))}

                {/* --- NEW: Pagination Buttons --- */}
                <div className="flex justify-center items-center space-x-4 mt-8 pb-10">
                  <button
                    onClick={() => fetchAll(prevUrl)}
                    disabled={!prevUrl}
                    className="flex items-center px-4 py-2 bg-white dark:bg-[#1A2A3A] border dark:border-gray-700 rounded-xl disabled:opacity-30 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <ChevronLeft size={20} className="mr-1" /> Previous
                  </button>
                  <button
                    onClick={() => fetchAll(nextUrl)}
                    disabled={!nextUrl}
                    className="flex items-center px-4 py-2 bg-white dark:bg-[#1A2A3A] border dark:border-gray-700 rounded-xl disabled:opacity-30 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Next <ChevronRight size={20} className="ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-10 bg-white dark:bg-[#1A2A3A] rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                <p className="text-lg font-medium dark:text-gray-300">No questions found.</p>
                <button onClick={() => navigate('/ask-question')} className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-xl">Ask Now</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-[#1A2A3A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
              <h4 className="text-xl font-bold mb-4 dark:text-white">Categories</h4>
              <div className="space-y-2">
                <button onClick={() => setFilterCategory(null)} className={`w-full text-left p-2 rounded-lg transition-colors ${!filterCategory ? 'text-blue-50 bg-blue-600 font-bold' : 'dark:text-gray-300'}`}>All Categories</button>
                {Array.isArray(categories) && categories.map(c => (
                  <button key={c.id} onClick={() => setFilterCategory(c.id)} className={`w-full text-left p-2 rounded-lg flex justify-between items-center transition-colors ${filterCategory === c.id ? 'text-blue-50 bg-blue-600 font-bold' : 'dark:text-gray-300'}`}>
                    <span>{getCategoryEmoji(c.icon)} {c.name}</span>
                    <span className="text-xs opacity-60">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A2A3A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
               <h4 className="text-xl font-bold mb-4 dark:text-white">Top Contributors</h4>
               <div className="space-y-3">
                 {topUsers?.sort((a,b) => b.points - a.points).slice(0,3).map(user => <UserCard key={user.id} user={user} />)}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllQuestionsPage;