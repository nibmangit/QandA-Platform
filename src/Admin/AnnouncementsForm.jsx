import { useState } from "react";
import { useNavigate } from "react-router-dom";  

const AnnouncementForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", 
    description: "",
    imageFile: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
    alert("Content posted successfully!");
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Post New Content
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title..."
            className="w-full p-3 border rounded-xl dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div> 

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description / Body
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Write your content here..."
            className="w-full p-3 border rounded-xl dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-700 dark:text-gray-300"
          />
          {form.imageFile && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Selected: {form.imageFile.name}
            </p>
          )}
        </div> 

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Post Content
        </button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
