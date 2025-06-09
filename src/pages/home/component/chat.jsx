import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import EmojiPicker from "emoji-picker-react";

function ChatArea({ onBack, socket }) {
  const { selectedChat, user: loggedInUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  if (!selectedChat) return null;

  const selectedUser = selectedChat.members.find(
    (member) => member._id !== loggedInUser._id
  );

  const fetchMessages = async () => {
    try {
      const response = await getAllMessages(selectedChat._id);
      if (response.success) {
        setAllMessages(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();

    socket.off("receive-message").on("receive-message", (data) => {
      if (data.chatId === selectedChat._id) {
        setAllMessages((prev) => {
          const exists = prev.some((msg) => msg._id === data._id);
          return exists ? prev : [...prev, data];
        });
      }
    });

    return () => socket.off("receive-message");
  }, [selectedChat, socket]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      chatId: selectedChat._id,
      sender: loggedInUser._id,
      text: message,
    };

    try {
      const response = await createNewMessage(newMessage);
      if (response.success) {
        setMessage("");
        setShowEmojiPicker(false);
        socket.emit("send-message", {
          ...response.data,
          members: selectedChat.members.map((m) => m._id),
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="bg-[#2e2e2e] flex flex-col text-white w-full h-[calc(100vh-60px)] md:h-[93vh]  rounded-none md:rounded-[10px] px-3 py-4 md:p-5 mx-[6px] sm:mx-[10px]">
     
      <div className="flex items-center justify-between border-b border-gray-600 pb-3 px-1 md:px-[30px] mb-3 md:mb-5">
        {onBack && (
          <button
            onClick={onBack}
            className="text-red-500 text-[18px] md:text-[20px] font-semibold flex items-center gap-2 hover:text-red-400 transition"
            aria-label="Back to chat list"
          >
            <i className="fa fa-arrow-left" /> <span className="hidden sm:inline">Back</span>
          </button>
        )}
        <div className="text-white font-bold flex-1 text-center truncate px-4">
          {selectedUser.firstname}
        </div>
        <div className="w-20" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 md:px-5 scrollbar-thin scrollbar-thumb-gray-600">
        {allMessages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col ${msg.sender === loggedInUser._id ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg text-sm max-w-[85%] sm:max-w-[70%] break-words ${
                msg.sender === loggedInUser._id
                  ? "bg-[#f1f1f1] text-black ml-10 rounded-tr-none"
                  : "bg-[#3a3a3a] text-white mr-10 rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="text-[10px] mt-1 text-gray-400">
                {msg.createdAt ? moment(msg.createdAt).format("hh:mm A") : ""}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="mt-3 relative px-1 md:px-5">
        <div className="flex items-center border border-gray-600 rounded-full px-4 py-2 bg-[#1f1f1f]">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-3 py-1 text-white bg-transparent outline-none border-none placeholder-gray-400 text-sm md:text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-[20px] md:text-[22px] text-white-400 mx-2 hover:text-yellow-300 transition"
            type="button"
          >
            <i className="fa fa-smile-o" />
          </button>

          <button
            onClick={sendMessage}
            className="text-[20px] md:text-[22px] text-white hover:text-blue-300 transition"
            type="button"
          >
            <i className="fa fa-paper-plane" />
          </button>
        </div>

        {showEmojiPicker && (
          <div
            className="absolute bottom-[60px] right-2 md:right-5 z-50 rounded-lg overflow-hidden shadow-lg"
            style={{ backgroundColor: "#1f1f1f" }}
          >
            <EmojiPicker
              onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              width={300}
              height={400}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatArea;