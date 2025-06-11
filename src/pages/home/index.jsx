import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './component/header';
import Sidebar from './component/sidebar';
import ChatArea from './component/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../../redux/userSlice';
import { io } from 'socket.io-client';

function Home() {
  const dispatch = useDispatch();
  const { selectedChat, user } = useSelector((state) => state.user);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const socketRef = useRef(null); // <== useRef for socket instance

  // Initialize socket connection once
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io('https://vibe-chat-api.onrender.com');

      socketRef.current.emit('join-room', user._id);
    }

    return () => {
      // Disconnect socket on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const handleResize = useCallback(() => {
    const isNowMobile = window.innerWidth < 1100;
    setIsMobile(isNowMobile);
    if (!isNowMobile) setIsChatOpen(false);
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
            <ChatArea onBack={isMobile ? handleBack : null} socket={socketRef.current} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
