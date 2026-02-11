import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = BookOpen, 
  title = "No Data Found", 
  message = "It looks like there's nothing here yet.", 
  buttonLabel = "Go Back", 
  buttonLink = "/questions",
  showButton = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-[#0F172A] rounded-4xl border border-gray-100 dark:border-gray-800 text-center space-y-6 transition-all shadow-sm">
      {/* Dynamic Icon with your Gold Color */}
      <div className="p-5 bg-yellow-400/10 rounded-3xl">
        <Icon size={64} className="text-yellow-500 opacity-90" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {showButton && (
        <Link 
          to={buttonLink} 
          className="flex items-center justify-center px-8 py-3 rounded-2xl text-white font-bold transition-all duration-300 hover:scale-[1.05] hover:shadow-lg bg-[#003366] active:scale-95"
        >
          {buttonLabel === "Explore Questions" && <Search size={18} className="mr-2" />}
          {buttonLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;