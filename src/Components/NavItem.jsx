import React from 'react';
import { BDU, BDU_DARK } from "../utils/css"; 

const DARK = BDU_DARK;

const NavItem = ({ label, icon: Icon, isActive, onClick, className = '' }) => {
  
  const baseClasses = `
    flex items-center p-3 w-full text-sm font-medium transition-colors rounded-xl hover:cursor-pointer
  `;

  const inactiveClasses = `
    text-[${BDU.TEXT}] hover:bg-gray-100 hover:text-[${BDU.ACCENT}]
    dark:text-[${DARK.TEXT}] dark:hover:bg-[${DARK.BG_SECONDARY}] dark:hover:text-[${DARK.ACCENT}]
  `;

  const activeClasses = `
    bg-[${BDU.ACCENT}] text-white shadow-lg shadow-blue-500/30
    dark:bg-[${DARK.ACCENT}] dark:text-white dark:shadow-none 
  `;


  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${isActive
          ? activeClasses
          : inactiveClasses
        }
        ${className}
      `}
    >
      
      {Icon && (
        <Icon 
          size={20} 
          className="mr-3 shrink-0" 
        />
      ) }
      
      <span>{label}</span>
    </button>
  );
};

export default NavItem;