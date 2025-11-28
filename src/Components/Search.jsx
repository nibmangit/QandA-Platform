

import { useQuestions } from "../context/QuestionContext";

export default function Search({show }) { 
const { handleSearch } = useQuestions();

  return ( 
    <div className={`relative mb-8 block  ${show?'':'md:hidden'}`}>
            <input
              type="text" 
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search questions..."
              className="
                    w-full p-2 pl-10 rounded-xl 
                    border border-gray-300 
                    focus:border-[#2563EB] 
                    focus:ring-1 focus:ring-[#2563EB] 
                    bg-white dark:bg-[#0F172A]
                    text-[#1E293B] dark:text-[#F1F5F9]
                    placeholder-gray-400 dark:placeholder-gray-500
                    transition  "  />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
  );
}
