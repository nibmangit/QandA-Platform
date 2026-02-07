import { useEffect, useState } from "react";
import { findUserByEmail } from "../api/userServiece";

const AuthorDisplay = ({ 
  email, 
  date, 
  label = "Answered", 
  size = "sm"
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (email) {
      findUserByEmail(email).then(setUser);
    }
  }, [email]);

  const avatarUrl = user?.avatar 
    ? user.avatar 
    : `https://placehold.co/100x100/4f06e5/ffffff?text=${email?.charAt(0).toUpperCase()}`;

  // 1. Define the scaling configuration
  const sizeConfig = {
    xs: {
      avatar: "h-5 w-5",
      text: "text-[10px]",
      date: "text-[8px]",
      gap: "gap-1.5"
    },
    sm: {
      avatar: "h-7 w-7",
      text: "text-[12px]",
      date: "text-[9px]",
      gap: "gap-2"
    },
    md: {
      avatar: "h-10 w-10",
      text: "text-sm",
      date: "text-[11px]",
      gap: "gap-3"
    }
  };

  // 2. Select current config (fallback to md)
  const current = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`flex items-center ${current.gap} text-gray-500 dark:text-gray-400`}>
      <img 
        src={avatarUrl} 
        alt="avatar" 
        className={`${current.avatar} rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm`} 
      />
      
      <div className="flex flex-col leading-tight">
        <span className={current.text}>
          {label && <span className="opacity-80">{label} by </span>}
          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            {user?.username || user?.name || email?.split('@')[0]}
          </span>
        </span>
        
        {date && (
          <span className={`${current.date} opacity-70`}>
            {new Date(date).toLocaleString([], { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthorDisplay;