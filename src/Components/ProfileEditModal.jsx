import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import { BDU } from "../utils/css";
import { updateProfile } from '../api/userServiece';
import { useAuth } from '../context/AuthContext';

const ProfileEditModal = ({ user, onClose }) => {
  const { updateCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    avatar: null,
    avatarPreview: user.avatar || null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ----------------- CHANGE HANDLERS -----------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' })); // clear error on change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: "Unsupported file type. Allowed: jpg, png, gif." }));
      return;
    }

    // Validate size (<5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, avatar: "Avatar file too large. Max size is 5MB." }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      avatar: file,
      avatarPreview: URL.createObjectURL(file),
    }));
    setErrors(prev => ({ ...prev, avatar: '' }));
  };

  // ----------------- FORM SUBMIT -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name cannot be empty";
    if (formData.bio && formData.bio.length > 300) newErrors.bio = "Bio cannot exceed 300 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('bio', formData.bio);
    if (formData.avatar) payload.append('avatar', formData.avatar);

    try {
      setIsLoading(true);
      const updatedUser = await updateProfile(payload);
      updateCurrentUser(updatedUser); // sync header & profile
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      // show backend validation errors
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 dark:bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-full max-w-lg mx-auto rounded-xl shadow-2xl bg-white dark:bg-[#1E293B]">
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <div className="p-4 rounded-t-xl flex justify-between items-center" style={{ backgroundColor: BDU.NAVY }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 overflow-hidden"
                   style={{ borderColor: BDU.GOLD, backgroundColor: BDU.TEXT }}>
                {formData.avatarPreview ? (
                  <img src={formData.avatarPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : <User className="w-6 h-6 text-white" />}
              </div>
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
            </div>
            <button onClick={onClose} type="button" className="text-white hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">
            {/* NAME */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium dark:text-gray-200 text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md dark:bg-[#0F172A] dark:text-gray-100 focus:ring-1 focus:ring-[#FDB813]"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* BIO */}
            <div className="flex flex-col">
              <label htmlFor="bio" className="text-sm font-medium dark:text-gray-200 text-gray-700">Bio</label>
              <textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md dark:bg-[#0F172A] dark:text-gray-100 focus:ring-1 focus:ring-[#FDB813] resize-none"
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            {/* AVATAR */}
            <div className="flex flex-col">
              <label htmlFor="avatar-upload" className="text-sm font-medium dark:text-gray-200 text-gray-700">Avatar</label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:rounded-md file:bg-gray-100 dark:file:bg-gray-700 cursor-pointer"
              />
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 pt-0 flex justify-end space-x-3">
            <button onClick={onClose} type="button" className="px-4 py-2 border rounded-md text-gray-800 dark:text-gray-200">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-md font-semibold text-white shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: BDU.ACCENT }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
