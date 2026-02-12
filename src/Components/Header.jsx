import { Mail, Bookmark ,Bell, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { BDU } from "../utils/css.jsx";
import Search from "./Search.jsx";
import { useAuth } from "../context/AuthContext.jsx";  
import { useNotifications } from "../context/NotificationContext.jsx";
import { useBookmarks } from "../context/BookmarkContext.jsx";

const Header = () => {
  const {unreadCount} = useNotifications();
  const {bookmarkCount} = useBookmarks();
  const { currentUser, isLoggedIn, openLogin, openRegister } = useAuth(); 
  const navigate = useNavigate();
  const { theme, toggleTheme, MoonIcon, SunIcon } = useTheme();  

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-40 shadow-md
        bg-white/95 dark:bg-[#1A2A3A] 
        backdrop-blur-sm border-b 
        border-gray-200 dark:border-[#1E293B]
        transition-all
      "
    >
      <div className="max-w-7xl mx-auto pb-0 pt-2 flex justify-between items-center pr-2">
 
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* Logo Image */}
          <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/Logo.png"
              alt="BDU Logo"
              className="h-full w-full object-contain"
            />
          </div> 
          <h1 className="ml-2 font-bold text-[#2563EB] dark:text-[#3B82F6]">
            <span className="block md:hidden"></span>
            <span className="hidden md:inline lg:hidden text-lg">Q & A</span>
            <span className="hidden lg:inline text-xl">Q & A Connect</span>
          </h1>
        </div> 
 
        <div className="hidden md:block w-full max-w-md mx-4">
          <Search show="show" /> 
        </div> 
 
        <div className="flex items-center space-x-4">
 
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="
              p-2 rounded-full 
              hover:bg-gray-200 dark:hover:bg-[#374151]
              bg-gray-100 dark:bg-[#1E293B]
              transition
              hover:cursor-pointer
            "
            title="Theme"
          >
            {theme === "light" ? (
              <MoonIcon className="w-6 h-6 text-[#1E293B]" />
            ) : (
              <SunIcon className="w-6 h-6 text-[#E6C25F]" />
            )}
          </button>
 
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
               
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#374151] bg-gray-100 dark:bg-[#1E293B] transition hover:cursor-pointer group"
                title="Notifications"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellDot className="text-blue-600 animate-pulse" size={22} />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1A2A3A]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell className="text-gray-500 dark:text-gray-300 group-hover:text-blue-500 transition-colors" size={22} />
                )}
              </button>

              {/* 2. Bookmarks */}
              <button
                onClick={() => navigate("/bookmarks")}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#374151] bg-gray-100 dark:bg-[#1E293B] transition hover:cursor-pointer group"
                title="Bookmarks"
              >
                <Bookmark size={24} className="text-[#1E293B] dark:text-[#F1F5F9] group-hover:text-green-500 transition-colors" />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1A2A3A]">
                    {bookmarkCount > 9 ? "9+" : bookmarkCount}
                  </span>
                )}
              </button> 

              {/* 4. Profile Avatar */}
              <div className="relative group pl-2">
                <button
                  onClick={() => navigate(`/profile/${currentUser.id}`)}
                  className="flex items-center space-x-2 p-0.5 rounded-full bg-gray-100 dark:bg-[#1E293B] hover:ring-2 hover:ring-[#2563EB] transition hover:cursor-pointer"
                  title="Profile"
                >
                  <img
                    src={
                      currentUser.avatar
                        ? currentUser.avatar
                        : `https://placehold.co/100x100/4f06e5/ffffff?text=${currentUser.name?.charAt(0).toUpperCase()}`
                    }
                    className="h-8 w-8 rounded-full object-cover"
                    alt="User avatar"
                  /> 
                </button>
              </div>
            </div>
          ) : (
            <div className="space-x-2"> 
              <button
                onClick={openLogin}
                className="px-3 md:px-5 py-2 text-sm font-semibold rounded-xl text-[#003366] dark:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#003366] transition cursor-pointer"
              >
                Login
              </button>
               
              <button
                onClick={openRegister}
                className="px-3 md:px-5 py-2 text-sm font-bold rounded-xl text-white shadow-md hover:opacity-90 transition cursor-pointer"
                style={{ backgroundColor: BDU.ACCENT }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div> 
      </div>
    </header>
  );
};

export default Header;
