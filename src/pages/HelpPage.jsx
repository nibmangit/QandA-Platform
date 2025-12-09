import { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const HelpPage = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

const filteredFaqs = faqs.map(section => {
    const filteredItems = section.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase())
    );
    return { ...section, items: filteredItems };
  })
  .filter(section => section.items.length > 0);

  return (
    <div
      className={`max-w-5xl mx-auto px-6 py-10 transition-colors duration-300 ${
        theme === "dark" ? "text-gray-200" : "text-gray-800"
      }`}
    > 

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <HelpCircle className="w-7 h-7 text-blue-500 dark:text-blue-400" />
        Help & FAQ
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Everything you need to know about using the BDU Q&A Connect platform.
      </p>
 
      <div className="relative max-w-xl mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search a question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg ${
            theme === "dark"
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white border border-gray-300"
          }`}
        />
      </div>
 
      <div className="space-y-10">
        {filteredFaqs.map((section, secIndex) => (
          <div key={secIndex}>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {section.category}
            </h2>

            <div className="space-y-4">
              {section.items.map((item, idx) => {
                const indexKey = `${secIndex}-${idx}`;
                const isOpen = openIndex === indexKey;

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-900"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : indexKey)
                      }
                      className="w-full flex justify-between items-center p-4 text-left cursor-pointer"
                    >
                      <span className="font-medium">{item.q}</span>
                      <ChevronDown
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
 
      <p className="mt-12 text-center text-gray-400 text-sm">
        Still need help? Contact us at <span className="underline">supportqa@gmail.com</span>
      </p>
    </div>
  );
};

export default HelpPage;


const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is BDU Q&A Connect?",
        a: "BDU Q&A Connect is a platform where students ask questions and get answers from peers, seniors, and instructors. It includes features like reputation points, categories, tags, bookmarks, messaging, and announcements."
      },
      {
        q: "Who can use this platform?",
        a: "All Bahir Dar University students, staff, and departments can use the platform to share knowledge and solve academic problems."
      }
    ],
  },
  {
    category: "Asking & Answering",
    items: [
      {
        q: "How do I ask a question?",
        a: "Navigate to the 'Ask Question' page, fill in the title, details, select a category and tags, and submit."
      },
      {
        q: "How do I answer a question?",
        a: "Open any question and scroll to the answer section. Type your answer and submit."
      },
      {
        q: "Can I edit my questions or answers?",
        a: "Yes. You can edit your posts anytime through the Edit Icon or button on your content."
      }
    ],
  },
  {
    category: "Reputation & Points",
    items: [
      {
        q: "How does the point system work?",
        a: `• Post Question → +5  
            • Post Answer → +10  
            • Answer Liked → +2  
            • Answer Disliked → -1  
            • Question Liked → +2  
            • Question Disliked → -1  
            • Bookmark → +1  
            • Comment → +1`
      },
      {
        q: "What benefits do points give me?",
        a: "Points increase your credibility, unlock badges, and help you rank higher in leaderboards."
      }
    ],
  },
  {
    category: "Bookmarks & Notifications",
    items: [
      {
        q: "How do bookmarks work?",
        a: "Click the bookmark icon on any question. Bookmarked questions appear in your 'Bookmarks' page."
      },
      {
        q: "How do notifications work?",
        a: "You receive notifications when someone answers your question, likes your post, or sends a message."
      }
    ],
  },
  {
    category: "Account & Settings",
    items: [
      {
        q: "How do I update my profile?",
        a: "Go to your Profile page. You can update your bio, picture, and personal info."
      },
      {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' option in the login page to reset through email."
      }
    ],
  },
];