
  const ActionButton = ({ icon: Icon, label, onClick, filled }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 p-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer"
    >
      {Icon && <Icon size={16} fill={filled} className="text-gray-600 dark:text-gray-300" />}
      <span className="text-gray-900 dark:text-gray-100">{label}</span>
    </button>
  );

  export default ActionButton;