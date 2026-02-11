import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Mail, 
  Megaphone, 
  Award, 
  MessageSquare,
  Bell
} from "lucide-react";

 
export const getNotificationConfig = (type) => {
  const configs = {
    like: { Icon: ThumbsUp, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    dislike: { Icon: ThumbsDown, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    comment: { Icon: MessageCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    message: { Icon: Mail, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    announcement: { Icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    badge: { Icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    answer: { Icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
  };

  return configs[type] || { Icon: Bell, color: 'text-gray-500', bg: 'bg-gray-500/10' };
};

 
export const formatNotiDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};