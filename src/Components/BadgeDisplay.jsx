
import GenerateBadgeIcon from "./GenerateBadgeIcon";

const BadgeDisplay = ({ badgeName, icon, description }) => (
    <div className="p-4 bg-white dark:bg-[#1A2A3A] rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3 mb-2"> 
        <span className="p-2 rounded-full bg-yellow-400 text-slate-900 dark:bg-yellow-600 dark:text-slate-900">
            <GenerateBadgeIcon icon={icon} /> 
        </span>
        <h5 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {badgeName}
        </h5>
      </div>

      <p className="text-sm text-gray-600 dark:text-slate-300">{description}</p>
  
    </div>
  );

  export default BadgeDisplay;