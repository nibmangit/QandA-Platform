import { useState, useMemo } from "react";
import { List,PanelLeftClose,PanelLeftOpen } from "lucide-react";
import { MOCK_QUESTIONS, MOCK_CATEGORIES, MOCK_USERS } from "../utils/mock/mockData";
import { BDU,BDU_DARK } from "../utils/css";
import QuestionCard from "../Components/QuestionCard";
import UserCard from "../Components/UserCard";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../Components/Search";
import { useQuestions } from "../context/QuestionContext";

 const SortButton = ({ label, value, sortBy, setSortBy }) => (

  <a
  onClick={() => setSortBy(value)}
  className={`px-2 py-0 text-sm font-semibold hover:cursor-pointer rounded-xl transition-colors
    ${sortBy === value ? `text-[${BDU.ACCENT}] shadow-sm underline` : `text-[${BDU.TEXT}] dark:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#2563EB] `}
    ${sortBy === value ?`BDU.ACCENT dark:hover:bg-[#2563EB] hover:text-gray-100 `: 'transparent'}
    `}
  >
    {label}
  </a> 
  );
const AllQuestionsPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const {searchText} = useQuestions();
  const location = useLocation();
  const tagFilter = location.state?.filterTag || null;
  const categoryFilter = location.state?.filterCategory || null;
 const filteredQuestions = useMemo(() => {
  let list = [...MOCK_QUESTIONS];
 
  if (categoryFilter) {
    list = list.filter(q => q.categoryId === categoryFilter);
  }
  if (filterCategory) {
    list = list.filter(q => q.categoryId === filterCategory);
  }
  
  if (tagFilter) {
  list = list.filter(q => q.tags.includes(tagFilter));
}
 
if (searchText.trim()) {
      const q = searchText.toLowerCase();

      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
 
  switch (sortBy) {
    case "most-liked":
      return list.sort((a, b) => b.likes - a.likes);
    case "most-answered":
      return list.sort((a, b) => b.answers - a.answers);
    case "newest":
    default:
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}, [sortBy, categoryFilter,filterCategory, searchText,tagFilter]);

 

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Search />
      <h2 className={`text-3xl font-bold mb-6 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>
        <List size={28} className="inline mr-2" /> All Community Questions
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
        {/* Questions List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filter Bar */}
          {filteredQuestions.length > 0? <div className={`flex flex-wrap gap-1 p-1 rounded-xl bg-white dark:bg-[${BDU_DARK.BG}] shadow-sm border border-gray-100`}>
            <span className={`text-sm font-semibold p-2 mr-2 hidden sm:block text-[${BDU.NAVY}]`}>Sort by:</span>
            <SortButton label="Newest" value="newest" sortBy={sortBy} setSortBy={setSortBy} />
            <SortButton label="Most Liked" value="most-liked" sortBy={sortBy} setSortBy={setSortBy} />
            <SortButton label="Most Answered" value="most-answered" sortBy={sortBy} setSortBy={setSortBy} />
          </div>:""}

          {filteredQuestions.length > 0 ? (
            filteredQuestions?.map(q => <QuestionCard key={q.id} question={q} />)
          ) : (
            <div className={`text-center p-10 bg-white dark:bg-[#2e302d88] rounded-2xl shadow-xl border border-gray-100`}>
              <p className="text-lg font-medium dark:text-[#FFFF]">No questions found in this category.</p>
              <button
                onClick={() => navigate('/ask-question')}
                className={`mt-4 px-4 py-2 text-white font-semibold bg-[${BDU.ACCENT}] rounded-xl shadow-md hover:opacity-90`} 
              >
                Be the first to ask!
              </button>
            </div>
          )}
        </div>  


        <div className={`lg:col-span-1 space-y-8`}>  
        <div
           className={`
                     lg:hidden p-0 fixed top-13 right-0 z-60
                    bg-transparent dark:text-[#F1F5F9]
                     rounded-lg
                   `}
                   title={`${isCategoryOpen?"Close":"Open Category"}`}
                 >
                   <button
                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                     className="flex items-center p-0 rounded-lg transition-colors duration-150 hover:bg-black/20"
                   >
                     <List size={24} className="mr-2 cursor-pointer" />
                   </button>
                 </div>

        <aside
          className={`fixed top-[55px] right-0 h-[calc(100vh-76px)] w-64 bg-white dark:bg-[#1A2A3A] border-r border-gray-200 dark:border-[#1E293B] p-4 pt-10 transition-transform duration-300 z-40 overflow-y-auto ${
            isCategoryOpen ? "-ranslate-x-0" : "translate-x-full"
          } lg:hidden`}
        >
          <div className={`bg-white dark:bg-[#1A2A3A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-[#1E293B]`}>
                    <h4 className={`text-xl font-bold mb-4 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>Category Filter</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() =>{ setFilterCategory(null) ; setIsCategoryOpen(false);}}
                        className={`w-full text-left dark:text-white p-2 rounded-xl transition-colors 
                          ${!filterCategory ? `bg-gray-100 font-semibold dark:bg-[#3B82F6] ` : `hover:bg-gray-50 dark:hover:bg-[#3B82F6] hover:cursor-pointer`}`}
                        
                      >
                        All Categories ({MOCK_QUESTIONS.length})
                      </button>
                      {MOCK_CATEGORIES.map(c => (
                        <button
                          key={c.id}
                          onClick={() =>{ setFilterCategory(c.id) ; setIsCategoryOpen(false);}}
                          className={`w-full text-left p-2 rounded-xl transition-colors dark:text-white flex justify-between items-center 
                            ${filterCategory === c.id ? `bg-gray-100 text-[${BDU.TEXT}] font-semibold dark:bg-[#3B82F6] dark:text-[#1d1818]` : `hover:bg-gray-50 dark:hover:bg-[#3B82F6] hover:cursor-pointer`}`}
                        >
                          {c.icon} {c.name}
                          <span className="text-xs font-normal opacity-70">{c.count}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {  navigate('/categories'); setIsCategoryOpen(false); }}
                      className={`w-full text-sm hover:bg-gray-200 dark:hover:bg-[#4475c5]
              bg-gray-100 dark:bg-[#1867e6] boarder-[${BDU.ACCENT}]  font-semibold mt-3 p-2 rounded-xl border border-dashed hover:cursor-pointer transition-colors`}
                      
                    >
                      Manage Categories
                    </button>
                  </div>
        </aside>

          <div className="hidden lg:block bg-white dark:bg-[#1A2A3A] dark:border-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100">
           <h4 className={`text-xl font-bold mb-4 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>Category Filter</h4>
            <div className="space-y-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`w-full text-left dark:text-white p-2 rounded-xl transition-colors 
                          ${!filterCategory ? `bg-gray-100 font-semibold dark:bg-[#3B82F6] ` : `hover:bg-gray-50 dark:hover:bg-[#3B82F6] hover:cursor-pointer`}`}
              >
                All Categories ({MOCK_QUESTIONS.length})
              </button>
              {MOCK_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`w-full text-left p-2 rounded-xl transition-colors dark:text-white flex justify-between items-center 
                            ${filterCategory === c.id ? `bg-gray-100 text-[${BDU.TEXT}] font-semibold dark:bg-[#3B82F6] dark:text-[#1d1818]` : `hover:bg-gray-50 dark:hover:bg-[#3B82F6] hover:cursor-pointer`}`}
                >
                  {c.icon} {c.name}
                  <span className="text-xs font-normal opacity-70">{c.count}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/categories')}
               className={`w-full text-sm hover:bg-gray-200 dark:hover:bg-[#4475c5]
              bg-gray-100 dark:bg-[#1867e6] boarder-[${BDU.ACCENT}]  font-semibold mt-3 p-2 rounded-xl border border-dashed hover:cursor-pointer transition-colors`}
                      
            >
              Manage Categories
            </button>
          </div>

          <div className="bg-white dark:bg-[#4372] p-6 rounded-2xl shadow-xl border border-gray-100">
            <h4 className={`text-xl text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}] font-bold mb-4 flex items-center`}>
               Top Contributors</h4>
            <div className="space-y-3">
              {MOCK_USERS.sort((a, b) => b.points - a.points).slice(0, 3).map(user => <UserCard key={user.id} user={user} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default AllQuestionsPage;