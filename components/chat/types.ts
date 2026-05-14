export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other' | 'system';
  timestamp: Date;
  encrypted: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  channelCode: string;
  timestamp: Date;
  encrypted: boolean;
  messageType: 'text' | 'system' | 'notification';
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  isActive: boolean;
}

export interface EncryptionStatus {
  isEncrypted: boolean;
  algorithm: string;
  keyExchanged: boolean;
}

export interface ChannelParticipant {
  userId: string;
  username: string;
  joinedAt: Date;
  isTyping: boolean;
}
