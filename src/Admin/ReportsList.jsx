import React from "react";

const ReportsList = ({ reportsCount }) => (
  <div className="space-y-2">
    {[...Array(reportsCount)].map((_, idx) => (
      <div key={idx} className="p-3 bg-red-50 dark:bg-red-900 border-l-4 border-red-400 rounded-xl transition-colors">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Report #{idx + 1}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Target: Question/Answer ID</p>
      </div>
    ))}
  </div>
);

export default ReportsList;
