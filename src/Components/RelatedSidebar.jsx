import { useNavigate } from "react-router-dom";

const RelatedSidebar = ({ questions }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 sticky top-24">
      <h3 className="text-xl font-bold mb-4 dark:text-white border-b dark:border-gray-700 pb-2">Related Questions</h3>
      <div className="space-y-4">
        {questions.length === 0 && <p className="text-gray-500 text-sm italic">No related questions yet.</p>}
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => navigate(`/questions/${q.id}`)}
            className="group block w-full text-left"
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors line-clamp-2">
              {q.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">
                    {q.answers_count} answers
                </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedSidebar;