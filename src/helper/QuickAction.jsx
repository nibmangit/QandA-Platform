  import React from 'react';
 import { BDU } from '../utils/css';
  
  const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <button
      onClick={onClick}
      className="p-4 rounded-xl shadow-md border transition-transform transform hover:scale-[1.02] border-gray-100 dark:border-gray-700 text-left bg-white dark:bg-[#1E293B] hover:cursor-pointer"
    >
      {Icon && <Icon size={24} className="mb-2" style={{ color: BDU.ACCENT }} />}
      <h5 className={`font-semibold text-[${BDU.ACCENT}]`}>{title}</h5>
      <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{description}</p>
    </button>
  );

    export default QuickAction;