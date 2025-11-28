import { useState } from "react";
import { MOCK_QUESTIONS, MOCK_ANSWERS } from "../utils/mock/mockData";
import { Clock } from "lucide-react";
import ActivityFeedContent from "../Components/ActivityFeedContent"; 
import FilterButton from "../helper/FilterButton";

const ActivityFeedPage = () => { 
  const allActivities = [
    { type: "question", user: "Almaz Birtukan", title: MOCK_QUESTIONS[0].title, id: MOCK_QUESTIONS[0].id, date: "2025-10-25" },
    { type: "answer", user: "Kebede Tilahun", title: "Answer on DL vs RL", id: MOCK_ANSWERS[0].questionId, date: "2025-10-25" },
    { type: "like", user: "Sara Genet", title: "liked your answer on grant writing.", id: MOCK_ANSWERS[2].questionId, date: "2025-10-27" },
    { type: "badge", user: "Almaz Birtukan", title: "earned a new badge: Helpful.", id: null, date: "2025-10-28" },
    { type: "question", user: "Kebede Tilahun", title: MOCK_QUESTIONS[2].title, id: MOCK_QUESTIONS[2].id, date: "2025-10-27" },
  ];

  const [filter, setFilter] = useState("All");

  const filteredActivities = allActivities.filter((a) => {
    if (filter === "All") return true;
    if (filter === "My Activity") return a.user === "Almaz Birtukan";
    if (filter === "System") return a.type === "badge";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        <Clock size={28} className="inline mr-2" /> Community Activity Timeline
      </h2>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2 p-3 mb-4 border-b border-gray-100 dark:border-slate-700">
          <FilterButton label="All" filter={filter} setFilter={setFilter} />
          <FilterButton label="My Activity" filter={filter} setFilter={setFilter} />
          <FilterButton label="System" filter={filter} setFilter={setFilter} />
        </div>

        <ActivityFeedContent
          activities={filteredActivities} 
        />
      </div>
    </div>
  );
};

export default ActivityFeedPage;
