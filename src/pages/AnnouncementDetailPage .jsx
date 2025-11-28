import { Bell } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_ANNOUNCEMENTS } from "../utils/mock/mockData";

const AnnouncementDetailPage = () => {
  const { announcementId } = useParams();
  const navigate = useNavigate();

  const announcement = MOCK_ANNOUNCEMENTS.find(a => a.id === announcementId);

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400">
        Announcement not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold flex items-center text-gray-900 dark:text-gray-100">
          <Bell size={28} className="inline mr-2" /> Announcement Details
        </h2>
      </div>

      {/* Announcement Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {announcement.title}
        </h3>

        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
          <span>{announcement.date}</span>
          {announcement.author && <span>• Author: {announcement.author}</span>}
        </div>

        <p className="text-base mt-4 text-gray-800 dark:text-gray-200">
          {announcement.body}
        </p>

        {announcement.image && (
          <img
            src={announcement.image}
            alt="Announcement"
            className="w-full mt-4 rounded-xl border border-gray-200 dark:border-gray-600 object-cover"
          />
        )}

        {announcement.tags && announcement.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {announcement.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          onClick={() => navigate(-1)}
        >
          Back to Announcements
        </button>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;
