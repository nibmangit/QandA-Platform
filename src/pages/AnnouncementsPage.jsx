import { useEffect, useState, useCallback } from "react";
import { Bell, Search, Loader2, Megaphone } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { getAnnouncements } from "../api/announcementService";
import EmptyState from "../Components/EmptyState";

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPage, setNextPage] = useState(null);

  // 1. Fetching logic
  const fetchAnnouncements = useCallback(async (url = "/announcements/", search = "") => {
    try {
      setLoading(true);
      const data = await getAnnouncements(url, search);
      
      // If it's a new search, replace data. If it's pagination, append data.
      if (url === "/announcements/") {
        setAnnouncements(data.results);
      } else {
        setAnnouncements(prev => [...prev, ...data.results]);
      }
      setNextPage(data.next);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAnnouncements("/announcements/", searchTerm);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchAnnouncements]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#1E293B] dark:text-white flex items-center">
        <Bell size={28} className="mr-2 text-yellow-500" />
        Official Noticeboard
      </h2>

      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements by title or content..."
            className="w-full p-3 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition outline-none"
          />
        </div>

        {loading && announcements.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {announcements?.map((ann, index) => (
              <div
                key={ann.id}
                className={`p-5 rounded-xl shadow-sm border-l-4 transition-all hover:translate-x-1 cursor-pointer
                  ${index === 0 && !searchTerm ? "border-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10" : "border-blue-500 bg-gray-50 dark:bg-[#0F172A]"}
                `}
                onClick={() => navigate(`/announcements/${ann.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">
                    {ann.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(ann.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
                  {ann.body}
                </p>

                <div className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center">
                  Read Full Notice <span className="ml-1">→</span>
                </div>
              </div>
            ))}
            
            {announcements.length === 0 && !loading && (
              <EmptyState 
                icon={Megaphone} 
                title="Quiet for Now" 
                message="There are no active announcements at the moment. Check back soon for updates from the faculty." 
                showButton={false} 
              />
            )}
          </div>
        )}

        {/* Load More Button */}
        {nextPage && (
          <button
            onClick={() => fetchAnnouncements(nextPage, searchTerm)}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {loading ? "Loading..." : "Load Older Announcements"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;