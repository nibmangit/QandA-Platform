import { BDU } from "../utils/css"; 
import { MOCK_QUESTIONS } from "../utils/mock/mockData";
import QuestionCard from "../Components/QuestionCard";
import { Bookmark } from "lucide-react";

function BookMarkPage(){
const bookmarks = MOCK_QUESTIONS.filter(q => q.is_bookmarked);

    return(
      <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        <Bookmark size={28} className="inline mr-2" /> Your Bookmarks
      </h2>
        <div className="max-w-4xl mx-auto">
        {bookmarks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {bookmarks.map(question => (
              <QuestionCard
                key={question.id} 
                question={question}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    )
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