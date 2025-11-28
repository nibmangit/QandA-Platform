import React from "react";
import { Users, MessageSquare, Shield } from "lucide-react";
import StatBox from "./StatBox";
import UsersTable from "./UsersTable";
import QuestionsTable from "./QuestionsTable";
import AnnouncementsForm from "./AnnouncementsForm";
import ReportsList from "./ReportsList";
import { MOCK_USERS, MOCK_QUESTIONS } from "../utils/mock/mockData";

const TabContent = ({ activeTab, usersCount, questionsCount, reportsCount }) => {
  switch (activeTab) {
    case "analytics":
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Platform Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox title="Active Users" value={usersCount} icon={Users} colorClass="text-blue-500 border-blue-500" />
            <StatBox title="Total Questions" value={questionsCount} icon={MessageSquare} colorClass="text-yellow-500 border-yellow-500" />
            <StatBox title="Pending Reports" value={reportsCount} icon={Shield} colorClass="text-red-500 border-red-500" />
          </div>
          <div className="bg-gray-50 dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
            Graph: Active Users & New Signups over time
          </div>
        </div>
      );
    case "manage-users":
      return <UsersTable users={MOCK_USERS} />;
    case "manage-content":
      return <QuestionsTable questions={MOCK_QUESTIONS.slice(0, 5)} />;
    case "post-announcements":
      return <AnnouncementsForm />;
    case "view-reports":
      return <ReportsList reportsCount={reportsCount} />;
    default:
      return null;
  }
};

export default TabContent;
