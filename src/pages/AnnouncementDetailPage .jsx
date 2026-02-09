import { useEffect, useState } from "react";
import { Bell, ArrowLeft, Calendar, User, Tag, Loader2, } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnnouncementById } from "../api/announcementService";
import ImageZoom from "../Components/ImageZoom";
import LoadingPage from "./LoadingPage";

const AnnouncementDetailPage = () => {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncementById(announcementId);
        setAnnouncement(data);
      } catch (err) {
        console.error("Failed to load announcement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [announcementId]);

  if (loading) { return ( <LoadingPage message="Loading the details..." isFullPage={false} /> );}

  if (!announcement) return null; // Or show error message

  return (
    <div className="max-w-4xl mx-auto py-10 px-4"> 
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Noticeboard
      </button>

       {announcement.image && (
        <ImageZoom src={announcement.image} alt={announcement.title} className="w-full h-64 md:h-96" />
       )}
  
        <div className="p-8 md:p-12">
          {/* Metadata Section */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {announcement.is_pinned && (
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1">
                📌 Pinned
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={16} className="text-blue-500" />
              {new Date(announcement.date).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <User size={16} className="text-green-500" />
              <span className="font-semibold">{announcement.author}</span>
            </div>
          </div>

          {/* Title and Content */}
          <h1 className="text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white leading-tight mb-8">
            {announcement.title}
          </h1>

          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {announcement.body}
            </p>
          </div>

          {/* Tags Section - Logic updated for your string array */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <Tag size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {announcement.tags.map((tagName, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all cursor-default"
                  >
                    #{tagName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div> 
  );
};

export default AnnouncementDetailPage;