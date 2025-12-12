import React, { useState} from 'react';
import { User, X } from 'lucide-react';
import { BDU } from "../utils/css";

const ProfileEditModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar 
  }); 
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value, 
    }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Saving changes:", formData); 
    onClose(); 
  };


  return (
    <div className="fixed inset-0 bg-opacity-30 dark:bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div  
        className="relative p-0 w-full max-w-lg mx-auto rounded-xl shadow-2xl transition-all duration-300 transform bg-white dark:bg-[#1E293B] border border-transparent"
      >
        <form onSubmit={handleSubmit}>  
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
      
             <div className="p-6 space-y-5">  
               <div className="flex items-center space-x-4">
                 <label 
                   className="w-24 text-sm font-medium dark:text-gray-200 text-gray-700"
                   htmlFor="name"
                 >
                   Name
                 </label>
                 <input 
                   id="name"
                   type="text" 
                   value={formData.name}
                   onChange={handleChange}
                   className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FDB813] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 transition-colors"
                 />
               </div> 
       
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
                   value={formData.email} 
                   onChange={handleChange}
                   className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FDB813] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 transition-colors"
                 />
               </div>
       
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
                   value={formData.bio} 
                   onChange={handleChange}
                   className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FDB813] dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 resize-none transition-colors"
                 ></textarea>
               </div>
 
               <div 
                 className="p-4 rounded-md text-xs dark:bg-blue-600 font-medium dark:text-gray-300" 
               > 
                 <input type="file" className="w-full" />
               </div>
             </div> 

             <div className="p-6 pt-0 flex justify-end space-x-3">
               <button 
                 onClick={onClose} 
                 type="button" 
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
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;