import { Bell } from "lucide-react";
import { MOCK_ANNOUNCEMENTS } from "../utils/mock/mockData";
import { BDU } from "../utils/css";
import { useNavigate } from "react-router-dom";

const AnnouncementsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[${BDU.NAVY}] dark:text-white flex items-center">
        <Bell size={28} className="mr-2" />
        Official Announcements Noticeboard
      </h2>

      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search announcements by keyword or date..."
            className="
              w-full p-3 pl-10 rounded-xl
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-[#0F172A]
              text-gray-800 dark:text-gray-200
              focus:border-[${BDU.ACCENT}] focus:ring-[${BDU.ACCENT}]
              transition
            "
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        {MOCK_ANNOUNCEMENTS.map((ann, index) => (
          <div
            key={ann.id}
            className={`
              p-5 rounded-xl shadow-md
              border-l-4
              ${index === 0 ? "border-yellow-500" : "border-blue-500"}
              bg-gray-50 dark:bg-[#0F172A]
            `}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-[${BDU.NAVY}] dark:text-white">
                {ann.title}
              </h3>

              <span className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {ann.date}
              </span>
            </div>

            <p className="text-sm mt-2 text-gray-700 dark:text-gray-200 line-clamp-2">
              {ann.body}
            </p>

            <button
              onClick={() => navigate(`/announcements/${ann.id}`)}
              className={`mt-3 text-sm font-semibold hover:underline text-[${BDU.ACCENT}] dark:text-[${BDU.ACCENT}]`}
            >
              Read More →
            </button>
          </div>
        ))}

        <div className="p-5 rounded-xl shadow-md border-l-4 border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-[#0F172A]">
          <h3 className="text-xl font-bold text-[${BDU.NAVY}] dark:text-white">
            Old Notice: Semester Break
          </h3>

          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Details about the 2024/2025 academic calendar semester break period.
          </p>

          <button className={`mt-3 text-sm font-semibold hover:underline text-[${BDU.ACCENT}] dark:text-[${BDU.ACCENT}]`}>
            Read More →
          </button>
        </div>

      </div>
    </div>
  );
};

export default AnnouncementsPage;
