import { useState, useMemo } from "react";
import { Mail, List, PlusSquare } from "lucide-react";
import { MOCK_MESSAGES } from "../utils/mock/mockData";
import { findUser } from "../utils/Find";
import { BDU } from "../utils/css";
import { useAuth } from "../context/AuthContext";

const generateUUID = () => crypto.randomUUID().slice(0, 8);

const InboxPage = () => {
  const { currentUser } = useAuth();
  const conversations = useMemo(() => {
    const convMap = MOCK_MESSAGES.reduce((acc, msg) => {
      if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
      acc[msg.conversationId].push(msg);
      return acc;
    }, {});

    return Object.keys(convMap)
      .map((id) => {
        const messages = convMap[id].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const lastMessage = messages[messages.length - 1];
        const otherUserId =
          lastMessage.senderId === currentUser.id
            ? lastMessage.receiverId
            : lastMessage.senderId;

        const otherUser = findUser(otherUserId);
        const unread = messages.filter(
          (m) => m.receiverId === currentUser.id && !m.read
        ).length;

        return { id, messages, lastMessage, otherUser, unread };
      })
      .sort(
        (a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date)
      );
  }, [currentUser.id]);

  const [activeConversation, setActiveConversation] = useState(
    conversations[0]?.id
  );
  const [newMessageText, setNewMessageText] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const activeConvData = conversations.find((c) => c.id === activeConversation);
  const chatMessages = activeConvData?.messages || [];

  const handleSendMessage = () => {
    if (!newMessageText || !activeConvData) return;

    const newMsg = {
      id: generateUUID(),
      conversationId: activeConversation,
      senderId: currentUser.id,
      receiverId: activeConvData.otherUser.id,
      body: newMessageText,
      date: new Date().toISOString(),
      read: false,
    };

    MOCK_MESSAGES.push(newMsg);
    setNewMessageText("");
  };

  const ConversationItem = ({ conv, isActive }) => (
    <button
      onClick={() => {
        setActiveConversation(conv.id);
        setIsMobileSidebarOpen(false);
      }}
      className={`
        flex items-center w-full p-4 text-left border-b 
        transition-colors cursor-pointer
        border-gray-200 dark:border-gray-700
        ${isActive 
          ? "bg-gray-100 dark:bg-gray-700" 
          : "hover:bg-gray-50 dark:hover:bg-gray-800"}
      `}
    >
      <div className="relative">
        <img
          src={conv.otherUser.avatar}
          alt={conv.otherUser.name}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />

        {conv.unread > 0 && (
          <span
            className="absolute top-0 right-3 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900"
            style={{ backgroundColor: BDU.ACCENT }}
          ></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="font-semibold truncate text-[#1E293B] dark:text-[#F1F5F9]">
          {conv.otherUser.name}
        </h5>

        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {conv.lastMessage.body}
        </p>
      </div>
    </button>
  );

  const MessageBubble = ({ message, isSender }) => {
    const senderBg = BDU.ACCENT;
    const receiverBg = "#3B89F6"; 

    return (
      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
        <div
          className={`
            relative max-w-[85%] sm:max-w-[70%] 
            px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap 
            ${isSender 
              ? "text-white" 
              : "text-gray-100 dark:text-gray-900 bg-gray-200 dark:bg-gray-700"}
          `}
          style={{
            backgroundColor: isSender ? senderBg : receiverBg,
            borderBottomRightRadius: isSender ? "4px" : "16px",
            borderBottomLeftRadius: isSender ? "16px" : "4px",
          }}
        >
          <p className="text-sm leading-relaxed pr-12">{message.body}</p>

          <span
            className={`
              absolute bottom-1 right-2 text-[10px]
              text-white/80  dark:text-white/80
            `}
          >
            {new Date(message.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto h-[90vh] py-10 px-4">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-[#003366] dark:text-[#E6C25F]">
        <Mail size={28} className="inline mr-2" /> Private Messaging (Inbox)
      </h2>

      {/* Main container */}
      <div className="
        h-[calc(100%-70px)] bg-white dark:bg-[#1E293B]
        rounded-2xl shadow-2xl overflow-hidden flex relative 
        border border-gray-100 dark:border-gray-700
      ">
        {/* LEFT PANEL - Conversation List */}
        <div
          className={`
            md:relative md:translate-x-0
            absolute inset-y-0 left-0 w-64 h-full 
            bg-white dark:bg-[#0F172A] z-50
            transform transition-transform duration-300
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-[#003366] dark:text-[#F1F5F9]">
              Conversations
            </h3>
          </div>

          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversation}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Chat */}
        <div className="flex-1 flex flex-col z-10 min-w-0">
          {activeConvData ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  {/* Sidebar toggle (mobile) */}
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <List size={20} className="text-gray-700 dark:text-gray-200" />
                  </button>

                  <img
                    src={activeConvData.otherUser.avatar}
                    alt={activeConvData.otherUser.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <h3 className="text-lg font-bold text-[#003366] dark:text-[#F1F5F9]">
                    {activeConvData.otherUser.name}
                  </h3>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#1E293B]">
                {chatMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isSender={msg.senderId === currentUser.id}
                  />
                ))}
                <div className="h-1"></div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-[#0F172A]">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="
                    flex-1 p-3 rounded-xl mr-3 
                    border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-[#1E293B]
                    text-[#1E293B] dark:text-[#F1F5F9]
                    focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6]
                    focus:border-[#2563EB] dark:focus:border-[#3B82F6]
                  "
                />

                <button
                  onClick={() => console.log("File Attachment")}
                  className="p-3 mr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <PlusSquare size={20} className="text-[#1E293B] dark:text-[#F1F5F9]" />
                </button>

                <button
                  onClick={handleSendMessage}
                  className="
                    px-4 py-3 text-white font-bold rounded-xl shadow-md 
                    hover:opacity-90
                  "
                  style={{ backgroundColor: BDU.ACCENT }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
              Select a conversation to start chatting.
            </div>
          )}
        </div>

        {/* Overlay for mobile */}
        {isMobileSidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InboxPage;
