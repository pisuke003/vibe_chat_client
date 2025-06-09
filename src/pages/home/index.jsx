import React, { useState, useEffect, useCallback } from 'react';
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle user room join
  useEffect(() => {
    if (user) {
      socket.emit('join-room', user._id);
    }
  }, [user]);


  const handleResize = useCallback(() => {
    const isNowMobile = window.innerWidth < 1100;
    setIsMobile(isNowMobile);

    if (!isNowMobile) {
      setIsChatOpen(false); 
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);


  useEffect(() => {
    setIsChatOpen(!!(isMobile && selectedChat));
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

      <div className="flex flex-1 w-full p-2 overflow-hidden">
     
        {(!isMobile || !isChatOpen) && (
          <div className="w-full md:w-[30%] h-full">
            <Sidebar openChat={openChat} />
          </div>
        )}

 
        {selectedChat && (!isMobile || isChatOpen) && (
          <div className="flex-1 h-full">
            <ChatArea onBack={isMobile ? handleBack : null} socket={socket} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
