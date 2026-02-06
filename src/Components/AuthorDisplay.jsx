import { useEffect, useState } from "react";
import { findUserByEmail } from "../api/userServiece";

const AuthorDisplay = ({ email, date, label = "Answered" }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (email) {
      findUserByEmail(email).then(setUser);
    }
  }, [email]);

  const avatarUrl = user?.avatar 
    ? user.avatar 
    : `https://placehold.co/100x100/4f06e5/ffffff?text=${email?.charAt(0).toUpperCase()}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
      <img src={avatarUrl} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
      <div className="flex flex-col">
        <span>
          {label} by{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            {user?.name || email.split('@')[0]}
          </span>
        </span>
        <span className="text-[10px] opacity-70">{new Date(date).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default AuthorDisplay;