const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false, 
  activeColor = "text-blue-500" // Default to blue for likes
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1.5 p-2 px-3 text-sm font-medium rounded-full transition-all hover:cursor-pointer
        ${active 
          ? 'bg-gray-100 dark:bg-gray-800' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
      `}
    >
      {Icon && (
        <Icon 
          size={18}  
          fill={active ? "currentColor" : "none"} 
          className={`transition-colors ${active ? activeColor : "text-gray-500 dark:text-gray-400"}`} 
        />
      )}
      
      <span className={`transition-colors ${active ? "font-bold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
        {label}
      </span>
    </button>
  );
};

export default ActionButton;