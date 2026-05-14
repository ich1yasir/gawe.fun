'use client'
import React from 'react';

interface ChatHeaderProps {
  isConnected: boolean;
  channelCode?: string;
  participantCount?: number;
  onLeaveChannel: () => void;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isConnected, 
  channelCode, 
  participantCount = 0,
  onLeaveChannel, 
  onClearChat 
}) => {
  const copyChannelCode = () => {
    if (channelCode) {
      navigator.clipboard.writeText(channelCode);
      // You could add a toast notification here
    }
  };

  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {channelCode && (
          <>
            {/* Mobile layout */}
            <div className="flex items-center space-x-1 md:hidden">
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{channelCode}</span>
                <button
                  onClick={copyChannelCode}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Copy channel code"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{participantCount}</span>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
                <span className="text-gray-600 dark:text-gray-400">Channel:</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{channelCode}</span>
                <button
                  onClick={copyChannelCode}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Copy channel code"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </>
        )}
        
        <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>End-to-End Encrypted</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
        {/* Mobile: Only show essential buttons */}
        <button
          onClick={onClearChat}
          className="p-1.5 md:px-3 md:py-1 rounded-md text-xs md:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Clear chat history"
        >
          <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden md:inline">Clear</span>
        </button>
        
        <button
          onClick={onLeaveChannel}
          className="p-1.5 md:px-3 md:py-1 rounded-md text-xs md:text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          title="Leave channel"
        >
          <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden md:inline">Leave Channel</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
