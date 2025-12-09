  import { formatScore } from "../utils/Find";
  
  const StatButton = ({ count, icon: Icon, colorClass, label, onClick, filled }) => (
    <div
      onClick={onClick}
      className="flex items-center hover:cursor-pointer space-x-1 font-semibold text-lg p-2 rounded-xl"
    >
      {Icon && <Icon size={20} fill={filled} className={`${colorClass}`} />}
      <span className="text-base text-gray-900 dark:text-gray-100">{formatScore(count)}</span>
      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 hidden sm:inline">{label}</span>
    </div>
  );

  export default StatButton