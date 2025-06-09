import React, { useState, useEffect } from 'react';
import Header from './component/header';
import Sidebar from './component/sidebar';
import ChatArea from './component/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../../redux/userSlice';
import { io } from 'socket.io-client';

const socket = io('https://vibe-chat-api.onrender.com');


function Home() {
  const dispatch = useDispatch();
  const { selectedChat, user } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      socket.emit('join-room', user._id);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 720);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && selectedChat) {
      setIsChatOpen(true);
    }
    if (!selectedChat) {
      setIsChatOpen(false);
    }
  }, [selectedChat, isMobile]);

  const openChat = (chat) => {
    dispatch(setSelectedChat(chat));
    if (isMobile) setIsChatOpen(true);
  };

  const handleBack = () => {
    setIsChatOpen(false);
    dispatch(setSelectedChat(null));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1f1f1f] text-white">
      <Header />
      <div className="flex flex-1 w-full p-2 ">
        {(!isMobile || !isChatOpen) && (
          <Sidebar openChat={openChat} />
        )}
        {selectedChat && (!isMobile || isChatOpen) && (
          <ChatArea onBack={isMobile ? handleBack : null} socket={socket} />
        )}
      </div>
    </div>
  );
}

export default Home;
