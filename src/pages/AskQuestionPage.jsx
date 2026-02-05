import { useState, useEffect } from "react";
import { PlusSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion, updateQuestion, getCategories, getTags, getQuestionById } from "../api/questionService";
import { BDU, BDU_DARK } from "../utils/css";

const QuestionFormPage = ({ mode = "ask" }) => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    imageFile: null,
  });
  const { title, category, description, imageFile } = form;
  const [categories, setCategories] = useState([]);
  // TAG STATE
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // Stores IDs: [1, 2, 5]
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);

  // FETCH INITIAL DATA (Categories & Tags)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, tags] = await Promise.all([getCategories(), getTags()]);
        setCategories(cats);
        setAllTags(tags);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  // LOAD QUESTION IN EDIT MODE
  useEffect(() => {
    const loadQuestion = async () => {
      if (mode === "edit" && questionId) {
        try {
          const question = await getQuestionById(questionId);
          console.log("Loaded question for edit:", question);
          setForm({
            title: question.title || "",
            category: question.category || "",
            description: question.body || "",
            imageFile: null,
          });

          // Handle tags regardless of whether API returns objects or just IDs
          if (question.tags && Array.isArray(question.tags)) {
            setSelectedTags(question.tags);
          }
        } catch (error) {
          console.error("Error loading question for edit:", error);
        }
      }
    };
    loadQuestion();
  }, [mode, questionId]);

  // HANDLE TAG INPUT CHANGE
  const handleTagInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setTagInput(value);

    if (!value.trim()) {
      setTagSuggestions([]);
      return;
    }

    const suggestions = allTags
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(value) &&
          !selectedTags.includes(tag.id)
      )
      .slice(0, 10);

    setTagSuggestions(suggestions);
  };

  // HANDLE TAG SELECTION
  const handleSelectTag = (tag) => {
    if (selectedTags.length >= 5) return; 
    if (!selectedTags.includes(tag.id)) {
      setSelectedTags([...selectedTags, tag.id]);
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  // HANDLE TAG REMOVE
  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !description) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", description);
    formData.append("category", category);

    // Append each tag ID to the same key for the backend array
    selectedTags.forEach((tagId) => formData.append("tags", tagId));

    if (imageFile) formData.append("image", imageFile);

    try {
      if (mode === "ask") {
        const createdQuestion = await createQuestion(formData);
        navigate(`/question/${createdQuestion.id}`);
      } else if (mode === "edit") {
        await updateQuestion(questionId, formData);
        navigate(`/question/${questionId}`);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto py-10 px-4 dark:text-[${BDU_DARK.TEXT}]`}>
      <h2
        className={`text-3xl font-bold mb-6 text-[${BDU.NAVY}] dark:text-[${BDU_DARK.TEXT}]`}
      >
        {mode === "ask" ? (
          <>
            <PlusSquare size={28} className="inline mr-2" /> Submit a New
            Question
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
          {/* TITLE */}
          <div>
            <label className={`block text-lg font-semibold mb-2`}>
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

          {/* DESCRIPTION */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Description (Details of your problem)
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Provide context, what you've tried, and any constraints..."
              rows="8"
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[${BDU.ACCENT}] focus:border-[${BDU.ACCENT}] dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Category / Department Tag
            </label>
            <select
              value={category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[${BDU.ACCENT}] focus:border-[${BDU.ACCENT}] dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white`}
              required
            >
              <option value="" className="dark:text-gray-400">
                -- Select Category --
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="dark:text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* TAGS */}
          <div className="relative">
            <label className="block text-lg font-semibold mb-2">
              Tags (Type to select, max 5)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="Start typing a tag..."
              className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-sky-400 focus:border-sky-400 shadow-sm text-gray-900 dark:bg-[${BDU_DARK.BG_SECONDARY}] dark:border-gray-600 dark:text-white`}
            />

            {/* SUGGESTIONS */}
            {tagSuggestions.length > 0 && (
              <ul className={`absolute z-50 w-full bg-white dark:bg-[${BDU_DARK.BG_SECONDARY}] border border-gray-300 dark:border-gray-600 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg`}>
                {tagSuggestions.map((tag) => (
                  <li
                    key={tag.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
                    onClick={() => handleSelectTag(tag)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}

            {/* SELECTED TAGS */}
            <div className="flex flex-wrap mt-2 gap-2">
              {selectedTags.map((tagId) => {
                const tag = allTags.find((t) => t.id === tagId);
                return (
                  <span
                    key={tagId}
                    className="px-3 py-1 rounded-full bg-sky-200 dark:bg-sky-700 text-gray-900 dark:text-white cursor-pointer select-none"
                    onClick={() => handleRemoveTag(tagId)}
                  > 
                    {tag ? tag.name : "..."} ×
                  </span>
                );
              })}
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Optional Image Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imageFile: e.target.files[0] })
                }
              />
              {imageFile ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  File Ready: {imageFile.name}
                </p>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer font-semibold hover:underline transition-colors"
                  style={{ color: BDU.ACCENT }}
                >
                  Attach Image or Drag-and-Drop Here
                </label>
              )}
              { mode === "edit" ? 
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-3 italic bg-gray-50 dark:bg-gray-800/50 py-2 px-4 rounded-lg">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Note:</span> Uploading a new image will replace the existing one.
              </span>: null }
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 font-semibold rounded-xl transition-colors border dark:bg-gray-600 border-gray-300 dark:border-gray-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 text-white font-bold rounded-xl shadow-md transition-all hover:opacity-90 cursor-pointer"
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