import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import {
  Home as HomeIcon, PlusSquare, BookOpen, Clock, Zap, Shield, User,
  List, Bell, Mail } from "lucide-react"; 
import {MOCK_MESSAGES } from "./utils/mock/mockData";

import { BDU } from "./utils/css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SideBar from "./Components/SideBar";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AskQuestionPage from "./pages/AskQuestionPage";
import AllQuestionsPage from "./pages/AllQuestionsPage";
import QuestionDetailsPage from "./pages/QuestionDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./Admin/AdminDashboard";
import ReputationPage from "./pages/ReputationPage";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import CategoryPage from "./pages/CategoryPage";
import InboxPage from "./pages/InboxPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementDetailPage from './pages/AnnouncementDetailPage ';
import { useAuth } from './context/AuthContext';

const App = () => { 
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const {currentUser,isLoggedIn} = useAuth()
  const unreadCount = MOCK_MESSAGES.filter(
    m => m.receiverId === currentUser?.id && !m.read
  ).length; 

  const sidebarNavItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/ask-question", label: "Ask Question", icon: PlusSquare, requiresAuth: true },
    { to: "/questions", label: "All Questions", icon: List },
    { to: "/categories", label: "Categories", icon: BookOpen },
    { to: "/reputation", label: "Reputation", icon: Zap },
    { to: "/activity-feed", label: "Activity Feed", icon: Clock },
    { to: "/inbox", label: "Inbox", icon: Mail, requiresAuth: true },
    { to: currentUser ? `/profile/${currentUser.id}` : "/auth", label: "My Profile", icon: User, requiresAuth: true },
    { to: "/admin-dashboard", label: "Admin Panel", icon: Shield, requiresAuth: true, adminOnly: true },
    { to: "/dashboard", label: "Dashboard", icon: Shield, requiresAuth: true },
    { to: "/notifications", label: "Notifications", icon: Bell, requiresAuth: true },
    { to: "/announcements", label: "Announcements", icon: Bell }, 
  ].filter(item => {
    if (item.requiresAuth && !isLoggedIn) return false;
    if (item.adminOnly && currentUser?.role !== "admin") return false;
    return true;
  });

const hiddenHeaderPaths = ["/auth", "/ask-question", "/admin-dashboard"];
const hiddenFooterPaths = ["/auth", "/ask-question", "/admin-dashboard", "/inbox"];
const showHeader = !hiddenHeaderPaths.includes(location.pathname);
const showFooter = !hiddenFooterPaths.includes(location.pathname);

  return (  
      <div
      className={`bd-[${BDU.BG} transition-colors duration-300  min-h-screen font-[Inter,sans-serif] dark:bg-[#0D1B2A]`}
      >

        <style>{`
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-roboto { font-family: 'Roboto', sans-serif; }
        `}</style>

       {showHeader && <Header 
          unreadCount={unreadCount}
        />}

        <main className="pt-[76px] pb-10">
          <SideBar sidebarNavItems={sidebarNavItems}  >
            <div className="flex-1 min-w-0 mt-6 lg:mt-0 px-4 lg:px-8">

              <Routes>

                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/questions" element={<AllQuestionsPage />} />
                <Route path="/question/:id" element={<QuestionDetailsPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/reputation" element={<ReputationPage />} />
                <Route path="/activity-feed" element={<ActivityFeedPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/announcements/:announcementId" element={<AnnouncementDetailPage />} />

                {/* Auth Route */}
                <Route path="/auth" element={ <AuthPage isRegister={isRegistering} setIsRegister={setIsRegistering}  /> } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={isLoggedIn ? ( <Dashboard /> ) : ( <Navigate to="/auth" replace /> )} />
                <Route  path="/ask-question"  element={isLoggedIn ? (<AskQuestionPage mode='ask' /> ) : (  <Navigate to="/auth" replace /> )}  />
                <Route  path="/edit-question/:questionId"  element={isLoggedIn ? (  <AskQuestionPage mode='edit' /> ) : (<Navigate to="/auth" replace /> )} />
                <Route  path="/profile/:userId"  element={isLoggedIn ? ( <UserProfilePage /> ) : ( <Navigate to="/auth" replace /> )} />
                <Route path="/inbox" element={isLoggedIn ? ( <InboxPage /> ) : ( <Navigate to="/auth" replace /> )}  />
                <Route  path="/notifications"  element={isLoggedIn ? ( <NotificationsPage /> ) : ( <Navigate to="/auth" replace />  )} />

                {/* Admin Only */}
                <Route
                  path="/admin-dashboard"
                  element={
                    currentUser?.role === "admin" ? (
                      <AdminDashboard />
                    ) : (
                      <div className="p-10 text-center text-red-500">
                        Access Denied: Admin required.
                      </div>
                    )
                  }
                />

                {/* 404 */}
                <Route  path="*"  element={<Navigate to="/" replace />} />

              </Routes>

            </div>
          </SideBar>
        </main>

        {showFooter && <Footer />}
      </div> 
  );
};

export default App;
