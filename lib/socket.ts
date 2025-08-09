import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Socket } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
  user_joined: (data: { userId: string; username: string; channelCode: string }) => void;
  user_left: (data: { userId: string; username: string; channelCode: string }) => void;
  typing_start: (data: { userId: string; username: string }) => void;
  typing_stop: (data: { userId: string; username: string }) => void;
  channel_info: (data: { participants: ChannelParticipant[]; totalCount: number }) => void;
  error: (error: string) => void;
}

export interface ClientToServerEvents {
  join_channel: (data: { channelCode: string; userId: string; username: string }) => void;
  leave_channel: (data: { channelCode: string; userId: string }) => void;
  send_message: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'channelCode'>) => void;
  typing_start: (data: { channelCode: string; userId: string; username: string }) => void;
  typing_stop: (data: { channelCode: string; userId: string; username: string }) => void;
  get_channel_info: (channelCode: string) => void;
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

export interface ChannelParticipant {
  userId: string;
  username: string;
  joinedAt: Date;
  isTyping: boolean;
}

export interface Channel {
  code: string;
  participants: Map<string, ChannelParticipant>;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export type SocketWithData = Socket<ClientToServerEvents, ServerToClientEvents> & {
  userId?: string;
  username?: string;
  channelCode?: string;
};
