import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_CATEGORIES,MOCK_QUESTIONS, MOCK_TAGS } from "../utils/mock/mockData";
import { BookOpen, Tags } from "lucide-react";
import { BDU, BDU_DARK } from "../utils/css"; 
import { getCategories, getTags } from "../api/questionService";
import { getCategoryEmoji } from "../helper/categoryIcons";
import LoadingPage from "./LoadingPage";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("categories"); 
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const tags = useTagsWithCount();

  useEffect(()=> {
    const fetchCategories = async () =>{
      try{
        const response = await getCategories();
        setCategories(response);
      }catch(error){
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);
  useEffect(() => {
      const fetchTags = async () => {
        try{
          setIsLoading(true);
          const response = await getTags(); 
          console.log("Fetched tags:", response);
          setTags(response); 
        }catch(error){
          console.error("Failed to fetch tags:", error);
        }finally{
          setIsLoading(false);
        }
      }
      fetchTags();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
 
      <h2
        className={`text-3xl font-bold mb-8 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}
      >
        <BookOpen size={28} className="inline mr-2" />
        Explore Topics
      </h2>
 
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView("categories")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors hover:cursor-pointer
              ${view === "categories"
                ? `bg-[#2563EB] dark:bg-[#3B82F6] dark:text-white text-gray-700]`
                : `bg-gray-200 dark:bg-[#1E293B]  dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#2563EB]`
              }
            `}
          >
            Categories
          </button>

          <button
            onClick={() => setView("tags")}
            className={`px-5 py-2 rounded-xl hover:cursor-pointer text-sm font-semibold transition-colors
              ${view === "tags"
                ? `bg-[${BDU.ACCENT}] text-white dark:bg-[${BDU.ACCENT}]`
                : `bg-gray-200 dark:bg-[#1E293B] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#2563EB]`
              }
            `}
          >
            Tags
          </button>
        </div> 
          
      {isLoading ? (
        <LoadingPage message="Loading categories..." isFullPage={false} />
      ) : view === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                navigate("/questions", { state: { filterCategory: cat.id } })
              }
              className={`p-6 bg-white dark:bg-[${BDU_DARK.BG}] rounded-2xl shadow-xl 
                border border-gray-100 dark:border-[#1E293B] text-left transition-transform 
                hover:scale-[1.03] hover:shadow-2xl hover:cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <span className={`text-4xl text-[${BDU.NAVY}]`}>{
                  getCategoryEmoji(cat.icon)
              }</span>
                <div>
                  <h3
                    className={`text-xl font-bold text-[${BDU.NAVY}] dark:text-[#2563EB]`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500">{cat.count} Questions</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      
      {isLoading ? (
        <LoadingPage message="Loading tags..." isFullPage={false} />
      ) : view === "tags" && (
        <div className="flex flex-wrap gap-3">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                navigate("/questions", { state: { filterTag: tag.id } })
              }
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold 
                bg-gray-200 text-gray-700 
                dark:bg-[#1E293B] dark:text-gray-200 
                hover:bg-[${BDU.ACCENT}] hover:text-white 
                dark:hover:bg-[#2563EB] hover:cursor-pointer
              `}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
