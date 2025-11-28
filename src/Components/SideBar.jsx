import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CornerUpRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { BDU, BDU_DARK } from "../utils/css";
import NavItem from "./NavItem";
import { useAuth } from "../context/AuthContext";

const DARK = BDU_DARK;

const SideBar = ({ children, sidebarNavItems}) => { 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {isLoggedIn, logout} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex">

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:block w-64 shrink-0 p-4 pt-10 sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto 
          bg-white border-r border-gray-200
          dark:bg-[${DARK.BG_SECONDARY}] dark:border-gray-700
        `}
      >
        <div className="space-y-2">
          {sidebarNavItems?.map((item) => (
            <Link key={item.to} to={item.to}>
              <NavItem
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            </Link>
          ))}
        </div>

        {isLoggedIn && (
          <div className={`mt-8 pt-4 border-t border-gray-200 dark:border-gray-700`}>
            <button
              onClick={handleLogout}
              className={`
                flex items-center p-3 w-full text-sm font-medium transition-colors rounded-xl 
                text-red-500 hover:bg-red-50 
                dark:text-red-400 dark:hover:bg-gray-700 hover:cursor-pointer
              `}
            >
              <CornerUpRight size={20} className="mr-3 transform rotate-180" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Sidebar Toggle Button (Full Width Bar) */}
<div  className={`
          lg:hidden p-0 fixed left-0 right-0 z-40 transition-colors duration-300 
            bg-gray-100
             top-20
          dark:bg-[${DARK.BG_SECONDARY}] dark:text-[#F1F5F9] 
        `}
      >
        <div className="lg:hidden p-0 fixed left-0 right-0 z-40 flex items-center justify-start max-w-7xl mx-auto">
          
          {/* Nested Button: The ONLY clickable element */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center p-0 rounded-lg transition-colors duration-150 hover:bg-black/20"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={24} className="mr-2" />
            ) : (
              <PanelLeftOpen size={24} className="mr-2" />
            )} 
          </button>
          
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-[60px] left-0 h-[calc(100vh-76px)] w-64 p-4 pt-10 transition-transform duration-300 z-55 overflow-y-auto 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden
          bg-white border-r border-gray-200
          dark:bg-[${DARK.BG_SECONDARY}] dark:border-gray-700
        `}
      > 
        <div className="space-y-2">
          {sidebarNavItems?.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
            >
              <NavItem
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            </Link>
          ))}
        </div>

        {isLoggedIn && (
          <div className={`mt-8 pt-4 border-t border-gray-200 dark:border-gray-700`}>
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className={`
                flex items-center p-3 w-full text-sm font-medium transition-colors rounded-xl 
                text-red-500 hover:bg-red-50
                dark:text-red-400 dark:hover:bg-gray-700 hover:cursor-pointer
              `}
            >
              <CornerUpRight size={20} className="mr-3 transform rotate-180" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Background Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {children}
    </div>
  );
};

export default SideBar;