import GenerateBadgeIcon from "./GenerateBadgeIcon";

const BadgeDisplay = ({ badgeName, icon, description }) => (
    <div className="group p-5 bg-white dark:bg-[#1A2A3A] rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-4 mb-3"> 
        {/* Softened the background so the emoji pops */}
        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            <GenerateBadgeIcon icon={icon} /> 
        </div>
        
        <h5 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {badgeName}
        </h5>
      </div>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {description}
      </p>
    </div>
);

export default BadgeDisplay;