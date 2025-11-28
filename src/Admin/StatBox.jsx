import React from "react";

const StatBox = ({ icon: Icon, title, value, colorClass }) => (
  <div className={`p-6 rounded-2xl shadow-lg border-l-4 dark:bg-[#1E293B] transition-colors ${colorClass}`}>
    {Icon && <Icon size={32} className={`mb-2 ${colorClass}`} />}
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export default StatBox;
