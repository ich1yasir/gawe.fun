import React, { useState, useEffect } from 'react';
import { ChannelParticipant } from './types';

interface ParticipantsListProps {
  participants: ChannelParticipant[];
  typingUsers: string[];
  currentUserId?: string;
  className?: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  participants, 
  typingUsers, 
  currentUserId,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close drawer when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-participants-drawer]')) {
          setIsOpen(false);
        }
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isOpen]);

  const formatJoinTime = (joinedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(joinedAt).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just joined';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Mobile drawer overlay
  if (isMobile) {
    return (
      <>
        {/* Floating toggle button for mobile - positioned at bottom right */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-20 lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Show participants"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {participants.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                {participants.length > 99 ? '99+' : participants.length}
              </div>
            )}
            {typingUsers.length > 0 && (
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
        </button>

        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <div 
          data-participants-drawer
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Participants ({participants.length})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close participants"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Participants List */}
          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {participants.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                No participants yet
              </p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {participant.username.charAt(0).toUpperCase()}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {participant.username}
                          {participant.userId === currentUserId && (
                            <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                          )}
                        </p>
                        {typingUsers.includes(participant.username) && (
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatJoinTime(participant.joinedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Typing indicator at bottom */}
          {typingUsers.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing...`
                }
              </p>
            </div>
          )}
        </div>
      </>
    );
  }

  // Desktop version - collapsible sidebar
  return (
    <div className={`bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out ${
      isOpen ? 'w-80' : 'w-16'
    } ${className}`}>
      {/* Collapse/Expand Button */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          {isOpen && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Participants ({participants.length})
            </h3>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isOpen ? 'Collapse participants' : 'Expand participants'}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Participants List - Hidden when collapsed */}
      {isOpen && (
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {participants.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              No participants yet
            </p>
          ) : (
            participants.map((participant) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.username}
                        {participant.userId === currentUserId && (
                          <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                        )}
                      </p>
                      {typingUsers.includes(participant.username) && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatJoinTime(participant.joinedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Collapsed state - show participant count */}
      {!isOpen && (
        <div className="p-3 text-center">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto">
            {participants.length}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Users
          </p>
          {typingUsers.length > 0 && (
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      )}
      
      {/* Typing indicator at bottom - only show when expanded */}
      {isOpen && typingUsers.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing...`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
