import React from 'react';
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

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Participants ({participants.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
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
      
      {typingUsers.length > 0 && (
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
