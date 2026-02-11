import { useState, useMemo, useEffect } from "react";
import { List, ChevronLeft, ChevronRight, Menu, X, Layers, BookOpen } from "lucide-react";
import QuestionCard from "../Components/QuestionCard"; 
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../Components/Search";
import { useQuestions } from "../context/QuestionContext"; 
import { getCategories, getQuestions } from "../api/questionService";
import { getCategoryEmoji } from "../helper/categoryIcons";
import LoadingPage from "./LoadingPage"; 
import { useQuestionActions } from "../hooks/useQuestionActions";
import TopContributors from "../Components/TopContributors";
import EmptyState from "../Components/EmptyState";

const SortButton = ({ label, value, sortBy, setSortBy }) => (
  <button
    onClick={() => setSortBy(value)}
    className={`px-3 py-1 text-sm font-semibold hover:cursor-pointer rounded-xl transition-colors
      ${sortBy === value ? `text-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm underline` : `text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}`}
  >
    {label}
  </button> 
);

const AllQuestionsPage = () => {
  const navigate = useNavigate(); 
  const { searchText } = useQuestions();
  const location = useLocation();
  const { questions, setQuestions, onLikeList, onBookmarkList, onDeleteList } = useQuestionActions();

  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(null); 
  const tagFilter = location.state?.filterTag || null;
  const categoryFilter = location.state?.filterCategory || null;
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const fetchAll = async (url = null) => {
    try {
      setLoading(true); 
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
 
const SidebarContent = () => (
  <div className="space-y-8">
    <div className="bg-white dark:bg-[#1A2A3A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
      <h4 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
        <Layers size={20} className="text-blue-500" /> Categories
      </h4>
      <div className="space-y-2"> 
        <button 
          onClick={() => { setFilterCategory(null); setIsMobileMenuOpen(false); }} 
          className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 font-medium cursor-pointer flex items-center gap-2
            ${!filterCategory 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none translate-x-1' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:translate-x-1'}`}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-40"></span>
          All Categories
        </button>

        {/* Dynamic Category List */}
        {categories.slice(0, 10).map(c => (
          <button 
            key={c.id} 
            onClick={() => { setFilterCategory(c.id); setIsMobileMenuOpen(false); }} 
            className={`w-full text-left p-2.5 rounded-xl flex justify-between items-center transition-all duration-200 cursor-pointer group
              ${filterCategory === c.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none font-bold translate-x-1' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:translate-x-1'}`}
          >
            <span className="flex items-center gap-2">
              <span className="group-hover:scale-110 transition-transform duration-200">
                {getCategoryEmoji(c.icon)}
              </span> 
              {c.name}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${filterCategory === c.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors'}`}>
              {c.count}
            </span>
          </button>
        ))}
 
        <button 
          onClick={() => navigate('/categories')} 
          className="w-full text-center py-3 mt-4 text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1 group cursor-pointer"
        >
          View All Categories 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>

    <div className="space-y-4">
       <TopContributors limit={5} showButton={true} /> 
    </div>
  </div>
);

  return ( 
    <div className="max-w-7xl mx-auto px-4 h-screen flex flex-col relative overflow-hidden">
      <div className="shrink-0 pt-6">
        <Search />
      </div>

      <div className="flex justify-between items-center mb-6 shrink-0 pt-4">
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white flex items-center">
          <List size={28} className="mr-2 text-blue-600" /> All Community Questions
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {loading ? (
        <LoadingPage message="Loading Questions..." isFullPage={false} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full overflow-hidden pb-6">
           
          <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
            {filteredQuestions.length > 0 && (
              <div className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-white/80 dark:bg-[#1A2A3A]/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold px-2 text-gray-500">Sort:</span>
                <SortButton label="Newest" value="newest" sortBy={sortBy} setSortBy={setSortBy} />
                <SortButton label="Likes" value="most-liked" sortBy={sortBy} setSortBy={setSortBy} />
                <SortButton label="Answers" value="most-answered" sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            )}

            {filteredQuestions.length > 0 ? (
              <>
                <div className="space-y-6">
                  {filteredQuestions.map(q => (
                    <QuestionCard 
                      key={q.id} 
                      question={q}  
                      onLike={onLikeList}
                      onBookmark={() => onBookmarkList(q.id, false)}
                      onDelete={() => onDeleteList(q.id)}
                    />
                  ))}
                </div>

                <div className="flex justify-center items-center space-x-4 mt-8 pb-10">
                  <button
                    onClick={() => fetchAll(prevUrl)}
                    disabled={!prevUrl}
                    className="flex items-center px-4 py-2 bg-white dark:bg-[#1A2A3A] border dark:border-gray-700 rounded-xl disabled:opacity-30 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} className="mr-1" /> Previous
                  </button>
                  <button
                    onClick={() => fetchAll(nextUrl)}
                    disabled={!nextUrl}
                    className="flex items-center px-4 py-2 bg-white dark:bg-[#1A2A3A] border dark:border-gray-700 rounded-xl disabled:opacity-30 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                  >
                    Next <ChevronRight size={20} className="ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <EmptyState 
              icon={BookOpen}
              title="No Questions Found" 
              message="It looks like no one has asked anything here yet. Be the first to start the conversation!" 
              buttonLabel="Ask Now" 
              buttonLink="/ask-question" 
            />
            )}
          </div>
 
          <div className="hidden lg:block lg:col-span-4 overflow-y-auto pr-1 pb-10 custom-scrollbar">
            <SidebarContent />
          </div>
        </div>
      )}
 
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div className={`absolute right-0 top-0 h-full w-[300px] bg-slate-50 dark:bg-[#0F172A] shadow-2xl p-6 overflow-y-auto transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold dark:text-white">Filters & Rankings</h3>
            <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default AllQuestionsPage;