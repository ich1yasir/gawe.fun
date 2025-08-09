'use client'
import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import ChannelJoin from './ChannelJoin';
import ParticipantsList from './ParticipantsList';
import { useSocket } from '../../hooks/useSocket';
import { chatStorage } from '../../lib/chatStorage';

const ChatInterface: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);
  const messagesTopRef = useRef<HTMLDivElement>(null);

  // Initialize persistent userId on component mount
  useEffect(() => {
    const persistentUserId = localStorage.getItem('gawe_user_id');
    const savedUserInfo = chatStorage.getUserInfo();
    
    if (savedUserInfo?.userId) {
      setCurrentUserId(savedUserInfo.userId);
      setCurrentUsername(savedUserInfo.username);
    } else if (persistentUserId) {
      setCurrentUserId(persistentUserId);
    }
  }, []);

  const {
    socket,
    isConnected,
    messages,
    participants,
    typingUsers,
    joinChannel,
    leaveChannel,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
    currentChannelCode,
    connectionError,
    autoReconnect,
    resetAutoReconnect,
    autoReconnectAttempts,
    maxAutoReconnectAttempts
  } = useSocket();

  // Auto-reconnect to latest channel when socket connects
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const attemptAutoReconnect = async () => {
      if (isConnected && !currentChannelCode && !isJoining && autoReconnectAttempts < maxAutoReconnectAttempts) {
        setIsAutoReconnecting(true);
        
        try {
          const reconnected = await autoReconnect();
          if (reconnected) {
            console.log('Successfully auto-reconnected to latest channel');
          } else if (autoReconnectAttempts >= maxAutoReconnectAttempts) {
            console.log('Max auto-reconnect attempts reached, giving up');
            resetAutoReconnect();
          }
        } catch (error) {
          console.error('Auto-reconnect error:', error);
        } finally {
          setIsAutoReconnecting(false);
        }
      }
    };

    if (isConnected && !currentChannelCode && !isJoining && autoReconnectAttempts < maxAutoReconnectAttempts) {
      // Small delay to ensure socket is fully ready
      timeoutId = setTimeout(attemptAutoReconnect, 1000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsAutoReconnecting(false);
    };
  }, [isConnected, currentChannelCode, isJoining, autoReconnectAttempts, maxAutoReconnectAttempts, autoReconnect, resetAutoReconnect]);

  // Scroll to top when new messages arrive (since newest are at top)
  useEffect(() => {
    if (messagesTopRef.current && messages.length > 0) {
      // Smooth scroll to top to show the latest message
      messagesTopRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleJoinChannel = async (channelCode: string, userId: string, username: string) => {
    setIsJoining(true);
    try {
      setCurrentUserId(userId);
      setCurrentUsername(username);
      joinChannel(channelCode, userId, username);
    } catch (error) {
      console.error('Failed to join channel:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveChannel = () => {
    leaveChannel();
    setCurrentUserId(null);
    setCurrentUsername(null);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleClearChat = () => {
    clearMessages();
  };

  // Show channel join screen if not connected to a channel
  if (!currentChannelCode) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <ChannelJoin
          onJoinChannel={handleJoinChannel}
          isConnected={isConnected}
          isLoading={isJoining}
          autoReconnecting={isAutoReconnecting}
          autoReconnectAttempts={autoReconnectAttempts}
          maxAutoReconnectAttempts={maxAutoReconnectAttempts}
          onResetAutoReconnect={resetAutoReconnect}
        />
        {connectionError && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm text-center">
            {connectionError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-6xl mx-auto gap-4">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <ChatHeader 
          isConnected={isConnected}
          channelCode={currentChannelCode}
          participantCount={participants.length}
          onLeaveChannel={handleLeaveChannel}
          onClearChat={handleClearChat}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
          disabled={!isConnected}
        />
        
        <div className="flex-1 overflow-hidden">
          <div 
            ref={messagesTopRef}
            className="h-full overflow-y-auto"
          >
            <MessageList 
              messages={messages} 
              currentUserId={currentUserId || undefined}
              isTopOriented={true}
            />
          </div>
        </div>

        {connectionError && (
          <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {connectionError}
          </div>
        )}
      </div>

      {/* Participants sidebar */}
      <div className="lg:w-80 flex-shrink-0">
        <ParticipantsList
          participants={participants}
          typingUsers={typingUsers}
          currentUserId={currentUserId || undefined}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default ChatInterface;
