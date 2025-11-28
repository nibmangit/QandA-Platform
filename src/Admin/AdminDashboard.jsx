import { useState } from "react";
import { Shield, Zap, Users, List, Bell, MessageSquare } from "lucide-react";
import TabContent from "./TabContent";
import NavItem from "../Components/NavItem";
import { MOCK_USERS, MOCK_QUESTIONS } from "../utils/mock/mockData";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const usersCount = MOCK_USERS.length;
  const questionsCount = MOCK_QUESTIONS.length;
  const reportsCount = 5;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors">
        <Shield size={28} className="inline mr-2" /> Admin Control Panel
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
          <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Moderation Tools</h4>
          <div className="space-y-2">
            <NavItem icon={Zap} label="Analytics" isActive={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
            <NavItem icon={Users} label="Manage Users" isActive={activeTab === "manage-users"} onClick={() => setActiveTab("manage-users")} />
            <NavItem icon={List} label="Manage Content" isActive={activeTab === "manage-content"} onClick={() => setActiveTab("manage-content")} />
            <NavItem icon={Bell} label="Post Announcements" isActive={activeTab === "post-announcements"} onClick={() => setActiveTab("post-announcements")} />
            <NavItem icon={MessageSquare} label="View Reports" isActive={activeTab === "view-reports"} onClick={() => setActiveTab("view-reports")} />
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
          <TabContent activeTab={activeTab} usersCount={usersCount} questionsCount={questionsCount} reportsCount={reportsCount} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
