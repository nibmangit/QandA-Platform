import React from 'react';

const NavItem = ({ label, icon: Icon, isActive, onClick, className = '' }) => {
  
  const baseClasses = `
    flex items-center p-3 w-full text-sm font-bold transition-all duration-200 
    rounded-xl cursor-pointer group relative overflow-hidden
  `;
 
  const inactiveClasses = `
    text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1
    dark:text-[#F1F5F9] dark:hover:bg-blue-900/20 dark:hover:text-[#3B82F6]
  `;
 
  const activeClasses = `
    bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 translate-x-1
    dark:bg-[#3B82F6] dark:text-white dark:shadow-none 
  `;

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${isActive ? activeClasses : inactiveClasses}
        ${className}
      `}
    > 
      {isActive && (
        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
      )}
       
      {Icon && (
        <Icon 
          size={20} 
          className={`mr-3 shrink-0 transition-transform duration-200 
            ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}
          `} 
        />
      )} 
      <span className="relative z-10">{label}</span>

      {!isActive && (
        <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-blue-400/0 group-hover:from-blue-400/5 transition-all" />
      )}
    </button>
  );
};

export default NavItem;