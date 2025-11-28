import React from "react";
import { Edit, Trash2 } from "lucide-react";

const QuestionsTable = ({ questions }) => (
  <div className="space-y-2">
    {questions.map((q) => (
      <div key={q.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#0F172A] rounded-xl transition-colors">
        <p className="font-semibold text-sm truncate max-w-sm text-gray-900 dark:text-gray-100">{q.title}</p>
        <div className="space-x-2">
          <button className="text-sm text-blue-500 hover:underline dark:text-blue-400 transition-colors">
            <Edit size={16} className="inline mr-1" /> Edit
          </button>
          <button className="text-sm text-red-500 hover:underline dark:text-red-400 transition-colors">
            <Trash2 size={16} className="inline mr-1" /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default QuestionsTable;
