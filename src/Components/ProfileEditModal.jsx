import { User, X } from 'lucide-react'; 
import { BDU } from "../utils/css";

const ProfileEditModal = ({ user, onClose }) => {
  return ( 
    <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div 
        className="relative p-0 w-full max-w-lg mx-auto rounded-xl shadow-2xl transition-all duration-300 transform bg-white dark:bg-[#1E293B] border border-transparent"
      >
        {/* Header */}
        <div 
          className="p-4 rounded-t-xl flex justify-between items-center"
          style={{ backgroundColor: BDU.NAVY }}
        >
          <div className="flex items-center space-x-3"> 
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ borderColor: BDU.GOLD, backgroundColor: BDU.TEXT }}
            >
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div> 
            <h3 className="text-xl font-semibold text-white">
              Edit Profile
            </h3>
          </div> 
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div className="flex items-center space-x-4">
            <label 
              className="w-24 text-sm font-medium dark:text-gray-200 text-gray-700"
              htmlFor="username"
            >
              Name
            </label>
            <input 
              id="username"
              type="text" 
              value={user.name}
              className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[${BDU.ACCENT}] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 transition-colors"
            />
          </div> 

          {/* Email */}
          <div className="flex items-center space-x-4">
            <label 
              className="w-24 text-sm font-medium dark:text-gray-200 text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input 
              id="email"
              type="email" 
              value={user.email} 
              className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[${BDU.ACCENT}] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Bio */}
          <div className="flex items-start space-x-4">
            <label 
              className="w-24 text-sm font-medium pt-2 dark:text-gray-200 text-gray-700"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea 
              id="bio" 
              rows="3"
              value={user.bio}
              className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[${BDU.ACCENT}] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 resize-none transition-colors"
            ></textarea>
          </div>

          {/* File Upload */}
          <div 
            className="p-4 rounded-md text-xs font-medium text-gray-500 dark:text-gray-300"
            style={{ backgroundColor: '#E5E7EB' }} 
          > 
            <input type="file" className="w-full" />
          </div>
        </div>
        
        {/* Footer Buttons */}
        <div className="p-6 pt-0 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded-md font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-md font-semibold text-white transition-colors hover:opacity-90 shadow-md"
            style={{ backgroundColor: BDU.ACCENT }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
