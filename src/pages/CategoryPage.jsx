import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Tags as TagsIcon } from "lucide-react"; 
import { getCategories, getTags } from "../api/questionService";
import { getCategoryEmoji } from "../helper/categoryIcons";
import LoadingPage from "./LoadingPage";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("categories"); 
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true); 
        const [catData, tagData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(catData);
        setTags(tagData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen"> 
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-3xl font-bold dark:text-white flex items-center">
          <BookOpen size={32} className="mr-3 text-blue-600" />
          Explore Community
        </h2>
 
        <div className="flex bg-gray-100 dark:bg-[#1E293B] p-1 rounded-2xl w-fit">
          <button
            onClick={() => setView("categories")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all hover:cursor-pointer ${
              view === "categories"
                ? "bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setView("tags")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all hover:cursor-pointer ${
              view === "tags"
                ? "bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            Tags
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingPage message={`Loading ${view}...`} isFullPage={false} />
      ) : (
        <> 
          {view === "categories" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate("/questions", { state: { filterCategory: cat.id } })}
                    className="group p-6 bg-white dark:bg-[#1A2A3A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-left transition-all hover:border-blue-500 hover:shadow-xl hover:cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl transition-transform group-hover:scale-110">
                        {getCategoryEmoji(cat.icon)}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cat.count || 0} Questions
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">No categories found.</p>
              )}
            </div>
          )}
 
          {view === "tags" && (
            <div className="bg-white dark:bg-[#1A2A3A] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => navigate("/questions", { state: { filterTag: tag.id } })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-[#0F172A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 transition-all hover:cursor-pointer flex items-center gap-2"
                    >
                      <TagsIcon size={14} />
                      {tag.name}
                      <span className="ml-1 opacity-60 text-xs">({tag.count || 0})</span>
                    </button>
                  ))
                ) : (
                  <p className="text-center w-full text-gray-500">No tags found.</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;