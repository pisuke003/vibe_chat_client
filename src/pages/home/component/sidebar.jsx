import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createNewChat } from './../../../apiCalls/chat';
import { setAllChats } from './../../../redux/userSlice';
import toast from 'react-hot-toast';

function Sidebar({ openChat }) {
  const [searchKey, setSearchKey] = useState('');
  const [loadingUsers, setLoadingUsers] = useState([]);

  const dispatch = useDispatch();
  const { allUsers, allChats, user: loggedInUser } = useSelector((state) => state.user);

  const startNewChat = async (searchUserId) => {
    setLoadingUsers((prev) => [...prev, searchUserId]);

    try {
      const response = await createNewChat([loggedInUser._id, searchUserId]);

      if (response.success) {
        toast.success(response.message || 'Chat started');
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(setAllChats(updatedChats));
        openChat(newChat);
      } else {
        toast.error(response.message || 'Failed to create chat');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoadingUsers((prev) => prev.filter((id) => id !== searchUserId));
    }
  };

   const filteredUsers = allUsers?.filter((user) => {
    if (user._id === loggedInUser._id) return false;

    const hasChat = allChats?.some(
      (chat) =>
        chat.members.some((m) => m._id === loggedInUser._id) &&
        chat.members.some((m) => m._id === user._id)
    );

       const isSearching = searchKey.trim().length > 0;
    const matchesSearch =
      user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchKey.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchKey.toLowerCase());

    return hasChat || (isSearching && matchesSearch);
  });

  const openChatHandler = (selectUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === loggedInUser._id) &&
        chat.members.some((m) => m._id === selectUserId)
    );

    if (chat) {
      openChat(chat);
    }
  };

  return (
    <div className="w-full lg:w-[30%]px-5 bg-[#1f1f1f] text-white h-screen border-r border-gray-700 overflow-y-auto">
      {/* Search Input */}
      <div className="relative mb-5 w-full max-w-xl mx-auto">
        <input
          type="text"
          className="w-full h-10 py-2 px-5 rounded-full border border-gray-600 text-white bg-[#2e2e2e] outline-none placeholder-gray-400"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search users..."
        />
        <i className="fa fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-[20px] text-gray-400 pointer-events-none" />
      </div>

      {filteredUsers?.length > 0 ? (
        filteredUsers.map((user) => {
          const hasChat = allChats?.some(
            (chat) =>
              chat.members.some((m) => m._id === loggedInUser._id) &&
              chat.members.some((m) => m._id === user._id)
          );

          const hideStartButton = hasChat || loadingUsers.includes(user._id);

          return (
            <div
              key={user._id}
              className="border-b border-gray-700 p-3 cursor-pointer hover:bg-[#2e2e2e] transition"
              onClick={() => openChatHandler(user._id)}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Avatar */}
                <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full bg-red-600 text-white text-[22px] font-bold flex items-center justify-center select-none">
                  {user.firstname?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1 px-3 min-w-0">
                  <div className="text-[16px] font-bold truncate">
                    {user.firstname + ' ' + (user.lastname || '')}
                  </div>
                  <div className="text-[12px] text-gray-400 truncate">{user.email}</div>
                </div>

             
                {!hideStartButton && (
                  <div className="w-[90px] sm:w-[100px] md:w-[120px] flex-shrink-0">
                    <button
                      className="px-4 py-2 w-full rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        startNewChat(user._id);
                      }}
                    >
                      Start Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-10">No users found.</div>
      )}
    </div>
  );
}

export default Sidebar;
