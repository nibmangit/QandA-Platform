import { Bell } from "lucide-react";
import {BDU,BDU_DARK} from "../utils/css";

const AnnouncementBanner = ({ announcement }) => {

return(
  <div
    className={`p-4 rounded-xl shadow-lg border-l-4 border-[${BDU.GOLD}] bg-[#F9FAFB]
    dark:bg-[${BDU_DARK.NAVY}] dark:border-[${BDU_DARK.GOLD}]
    `}
  >
    <div className={`flex items-start `}>
      <Bell size={24} className={`mr-3 mt-1 text-[${BDU.TEXT}] dark:text-[${BDU_DARK.TEXT}]`} />
      <div>
        <h4 className={`font-bold text-[${BDU.NAVY}] dark:text-[${BDU_DARK.ACCENT}]`}>{announcement.title}</h4>
        <p className={`text-sm mt-1 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>
          {announcement.body} <span className="text-xs font-medium ml-2 whitespace-nowrap opacity-70">({announcement.date})</span>
        </p>
      </div>
    </div>
  </div>
);
}
export default AnnouncementBanner;