import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { 
  Home as HomeIcon, PlusSquare, BookOpen, HelpCircle, Zap, Shield, User,
  List, Bell, Mail 
} from "lucide-react"; 
  
import { useAuth } from './context/AuthContext';
import { getTitleForPath } from './helper/getTitleForPath';
import {ProtectedRoute} from './helper/Protect';
 
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SideBar from "./Components/SideBar";
import AuthPage from "./pages/AuthPage"; 
import LoadingPage from './pages/LoadingPage'; 
 
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AskQuestionPage from "./pages/AskQuestionPage";
import AllQuestionsPage from "./pages/AllQuestionsPage";
import QuestionDetailsPage from "./pages/QuestionDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from './pages/NotFoundPage';
import ReputationPage from "./pages/ReputationPage"; 
import AnnouncementsPage from "./pages/AnnouncementsPage";
import CategoryPage from "./pages/CategoryPage"; 
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementDetailPage from './pages/AnnouncementDetailPage ';
import BookMarkPage from './pages/BookMarkPage';
import ForgotPassword from './pages/ForgotPassword';
import HelpPage from './pages/HelpPage';
import ResetPassword from './pages/ResetPassword';

const App = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, isLoading, isAuthOpen,openLogin, closeAuth,  isRegisterMode, setIsRegisterMode } = useAuth();
 
  useEffect(() => {
    // Check if we just arrived from the ResetPassword page
    if (location.state?.triggerLogin) { 
      openLogin();

      // 2. Clean the URL state so it doesn't pop up again if they refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, openLogin, navigate]);

  useEffect(() => {
    const currentTitle = getTitleForPath(location.pathname);
    document.title = currentTitle;
  }, [location.pathname]); 
 
  const sidebarNavItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/ask-question", label: "Ask Question", icon: PlusSquare, requiresAuth: true },
    { to: "/questions", label: "All Questions", icon: List },
    { to: "/categories", label: "Categories", icon: BookOpen },
    { to: "/reputation", label: "Reputation", icon: Zap },  
    { to: currentUser ? `/profile/${currentUser.id}` : "/", label: "My Profile", icon: User, requiresAuth: true },
    { to: "/dashboard", label: "Dashboard", icon: Shield, requiresAuth: true },
    { to: "/notifications", label: "Notifications", icon: Bell, requiresAuth: true },
    { to: "/announcements", label: "Announcements", icon: Bell }, 
    { to: "/help", label: "Help", icon: HelpCircle }, 
  ].filter(item => !item.requiresAuth || isLoggedIn);
 
  const fullScreenPaths = ["/notfound", "/forgot-password", "/reset-password"];
  const isFullScreenPage = fullScreenPaths.some(path => location.pathname.startsWith(path));

  const showHeader = !isFullScreenPage;
  const showFooter = !isFullScreenPage;

  if (isLoading) {
    return <LoadingPage />;
  }

  return (  
    <div className="transition-colors duration-300 min-h-screen font-[Inter,sans-serif] dark:bg-[#0D1B2A]">
      
      <style>{`
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
      `}</style>

      {showHeader && (
        <Header /> )}

      <main className="pt-[76px] pb-10 flex-1 min-w-0 lg:ml-64">
        {isFullScreenPage ? (
          <Routes>
            <Route path="/notfound" element={<NotFoundPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/notfound" replace />} />
          </Routes>
        ) : (
          <SideBar sidebarNavItems={sidebarNavItems}>
            <div className="flex-1 min-w-0 mt-6 lg:mt-0 px-4 lg:px-8">
              <Routes>  
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/questions" element={<AllQuestionsPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/reputation" element={<ReputationPage />} /> 
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/announcements/:announcementId" element={<AnnouncementDetailPage />} /> 
                <Route path="/help" element={<HelpPage />} /> 

                {/* --- PROTECTED ROUTES (URL SECURED) --- */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailsPage /></ProtectedRoute>} />
                <Route path="/ask-question" element={<ProtectedRoute><AskQuestionPage mode='ask' /></ProtectedRoute>} />
                <Route path="/edit-question/:questionId" element={<ProtectedRoute><AskQuestionPage mode='edit' /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} /> 
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><BookMarkPage /></ProtectedRoute>} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/notfound" replace />} />
              </Routes>
            </div>
          </SideBar>
        )}
 
        <AuthPage 
          isOpen={isAuthOpen} 
          onClose={closeAuth} 
          isRegister={isRegisterMode} 
          setIsRegister={setIsRegisterMode} 
        />
      </main>

      {showFooter && <Footer />}
    </div> 
  );
};

export default App;