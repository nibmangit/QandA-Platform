
import { MOCK_BADGES } from "../utils/mock/mockData";
export const getUserBadges = (user) => {
 const userBadges = MOCK_BADGES.filter(badge =>user.badges?.includes(badge.id));

 return userBadges;

}