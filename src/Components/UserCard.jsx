import { useNavigate } from "react-router-dom";
import { formatScore } from "../utils/Find";
import {BDU,BDU_DARK} from "../utils/css";
import { getUserBadges } from "../helper/getUserBadges";

const UserCard = ({ user }) => {
  const navigate = useNavigate()
  const userBadges = getUserBadges(user);

return(
  <div
    className={`flex items-center p-3 bg-white dark:bg-[#253546] rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    onClick={() => navigate(`/profile/${user.id}`)}
  >
    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover mr-3" />
    <div>
      <h4 className={`font-semibold text-[${BDU.TEXT}] dark:text-[${BDU_DARK.ACCENT}] `}>{user.name}</h4>
      <p className={`text-xs text-gray-500 dark:text-[${BDU_DARK.GOLD}] `}>
        {formatScore(user.points)} Points
        <span className="ml-2 inline-flex items-center">
          {userBadges.slice(0, 1).map(badge => (
            <span 
              key={badge.id} 
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700"
            >
              {badge.name} 
            </span>
          ))}
        </span>
      </p>
    </div>
  </div>
);
}
export default UserCard;