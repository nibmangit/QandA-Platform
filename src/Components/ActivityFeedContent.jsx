import { PlusSquare, MessageSquare, ThumbsUp, Zap } from "lucide-react";
import { BDU, BDU_DARK } from "../utils/css";
import { useNavigate } from "react-router-dom";

const ActivityFeedContent = ({ activities }) => {
  const navigate = useNavigate();
  return (
    <div className={`space-y-4`}>
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`flex items-start p-3 bg-gray-50 dark:bg-[#1d2b3a] rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
        >
          <div className="shrink-0 mr-4 mt-1">
            {activity.type === "question" && (
              <PlusSquare size={20} className={`text-[${BDU.ACCENT}]`} />
            )}
            {activity.type === "answer" && (
              <MessageSquare size={20} className="text-green-500" />
            )}
            {activity.type === "like" && (
              <ThumbsUp size={20} className="text-yellow-600" />
            )}
            {activity.type === "badge" && (
              <Zap size={20} className="text-purple-600" />
            )}
          </div>
          <div>
            <p
              className={`text-sm font-medium text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`}
            >
              <span
                className={`font-semibold text-[${BDU.NAVY}] dark:text-[#48f080]`}
              >
                {activity.user}
              </span>{" "}
              {activity.type === "question"
                ? "asked a new question:"
                : activity.type === "answer"
                ? "answered a question:"
                : activity.type === "like"
                ? activity.title
                : "earned a badge:"}
            </p>
            {activity.title && (
              <button
                onClick={() =>
                  activity.id && navigate(`/question${activity.id}`)
                }
                className={`text-xs italic hover:underline text-[${BDU.ACCENT}] dark:text-[${BDU_DARK.ACCENT}]`}
              >
                {activity.title}
              </button>
            )}
            <p className="text-xs text-gray-400 mt-1">Just now</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ActivityFeedContent;
