import { useState, useEffect } from "react";
import { PlusSquare } from "lucide-react";
import { MOCK_QUESTIONS, MOCK_CATEGORIES } from "../utils/mock/mockData";
import { BDU, BDU_DARK } from "../utils/css"; 
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const generateUUID = () => crypto.randomUUID().slice(0, 8);

const QuestionFormPage = ({ mode = "ask" }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { questionId } = useParams(); // for edit mode

  
const [form, setForm] = useState({
  title: "",
  category: "",
  description: "",
  imageFile: null,
  tagInput: "",
});

// Extract fields for easy usage
const { title, category, description, imageFile, tagInput } = form;

useEffect(() => {
  function loadQuestion() {
    if (mode === "edit" && questionId) {
      const question = MOCK_QUESTIONS.find((q) => q.id === questionId);

      if (question) {
        setForm({
          title: question.title,
          category: question.categoryId,
          description: question.body,
          imageFile: null,
          tagInput: question.tags.join(", "),
        });
      }
    }
  }

  loadQuestion();
}, [mode, questionId]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category || !description) return;

    const cleanedTags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t !== "");

    if (mode === "ask") {
      // CREATE NEW QUESTION
      const newQuestion = {
        id: generateUUID(),
        title,
        categoryId: category,
        authorId: currentUser.id,
        body: description,
        tags: cleanedTags,
        likes: 0,
        dislikes: 0,
        answers: 0,
        date: new Date().toISOString(),
        image: imageFile
          ? "https://placehold.co/600x300/FDB813/003366?text=User+Image+Placeholder"
          : null,
      };
      MOCK_QUESTIONS.unshift(newQuestion);
      navigate(`/question/${newQuestion.id}`);
    } else if (mode === "edit") {
      // UPDATE EXISTING QUESTION
      const index = MOCK_QUESTIONS.findIndex((q) => q.id === questionId);
      if (index !== -1) {
        MOCK_QUESTIONS[index] = {
          ...MOCK_QUESTIONS[index],
          title,
          categoryId: category,
          body: description,
          tags: cleanedTags,
          image: imageFile
            ? "https://placehold.co/600x300/FDB813/003366?text=Updated+Image"
            : MOCK_QUESTIONS[index].image,
        };
        navigate(`/question/${questionId}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 dark:text-[${BDU_DARK.TEXT}]">
      <h2 className={`text-3xl font-bold mb-6 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}>
        {mode === "ask" ? (
          <>
            <PlusSquare size={28} className="inline mr-2" /> Submit a New Question
          </>
        ) : (
          <>Edit Question</>
        )}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className={`lg:col-span-2 space-y-6 bg-white dark:bg-[${BDU_DARK.BG}] dark:text-[${BDU_DARK.TEXT}] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-[${BDU_DARK.BG_SECONDARY}]`}
        >
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold mb-2" style={{ color: BDU.TEXT }}>
              Question Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
              }
              placeholder="E.g., Which is better for X, Python or Java?"
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[${BDU.ACCENT}] focus:border-[${BDU.ACCENT}] dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold mb-2" style={{ color: BDU.TEXT }}>
              Description (Details of your problem)
            </label>
            <textarea
              value={description}
              onChange={(e) => 
                setForm({...form, description:e.target.value})
              }
              placeholder="Provide context, what you've tried, and any constraints..."
              rows="8"
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[${BDU.ACCENT}] focus:border-[${BDU.ACCENT}] dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg font-semibold mb-2" style={{ color: BDU.TEXT }}>
              Category / Department Tag
            </label>
            <select
              value={category}
              onChange={(e) => setForm({...form, category:e.target.value})}
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[${BDU.ACCENT}] focus:border-[${BDU.ACCENT}] dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white`}
              required
            >
              <option value="" className="dark:text-gray-400">-- Select Category --</option>
              {MOCK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="dark:text-white">{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-[${BDU_DARK.TEXT}] mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) =>setForm({ ...form, tagInput: e.target.value })}
              placeholder="e.g., java, html, css, react"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-sky-400 focus:border-sky-400 shadow-sm text-gray-900 dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold mb-2" style={{ color: BDU.TEXT }}>
              Optional Image Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => setForm({...form, imageFile:e.target.files[0]})}
              />
              {imageFile ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  File Ready: {imageFile.name}
                </p>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer font-semibold hover:underline transition-colors" style={{ color: BDU.ACCENT }}>
                  Attach Image or Drag-and-Drop
                </label>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 font-semibold rounded-xl transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[${BDU_DARK.BG_SECONDARY}]"
              style={{ color: BDU.TEXT }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 text-white font-bold rounded-xl shadow-md transition-all hover:opacity-90"
              style={{ backgroundColor: BDU.ACCENT }}
            >
              {mode === "ask" ? "Post Question" : "Update Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormPage;
