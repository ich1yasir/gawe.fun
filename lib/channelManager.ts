import { Channel, ChatMessage, ChannelParticipant } from '../lib/socket';

class ChannelManager {
  private channels: Map<string, Channel> = new Map();
  private disconnectedUsers: Map<string, { channelCode: string; userId: string; username: string; disconnectTime: number }> = new Map();
  private readonly MAX_CHANNELS = 1000;
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly CHANNEL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly DISCONNECT_GRACE_PERIOD = 30 * 1000; // 30 seconds grace period for reconnection

  constructor() {
    // Cleanup inactive channels periodically
    setInterval(() => {
      this.cleanupInactiveChannels();
      this.cleanupDisconnectedUsers();
    }, this.CLEANUP_INTERVAL);
  }

  generateChannelCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  createChannel(code?: string): string {
    const channelCode = code || this.generateChannelCode();
    
    // Check if channel already exists
    if (this.channels.has(channelCode)) {
      return channelCode;
    }

    // Limit number of channels
    if (this.channels.size >= this.MAX_CHANNELS) {
      this.cleanupOldestChannels();
    }

    const channel: Channel = {
      code: channelCode,
      participants: new Map(),
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.channels.set(channelCode, channel);
    return channelCode;
  }

  getChannel(channelCode: string): Channel | undefined {
    return this.channels.get(channelCode);
  }

  joinChannel(channelCode: string, userId: string, username: string): boolean {
    let channel = this.channels.get(channelCode);
    
    // Create channel if it doesn't exist
    if (!channel) {
      this.createChannel(channelCode);
      channel = this.channels.get(channelCode)!;
    }

    // Check if user was already in the channel
    const existingParticipant = channel.participants.get(userId);
    const isNewParticipant = !existingParticipant;

    const participant: ChannelParticipant = {
      userId,
      username,
      joinedAt: existingParticipant?.joinedAt || new Date(),
      isTyping: false
    };

    channel.participants.set(userId, participant);
    channel.lastActivity = new Date();

    // Only add system message for truly new participants
    if (isNewParticipant) {
      this.addSystemMessage(channelCode, `${username} joined the channel`);
    }

    return isNewParticipant;
  }

  leaveChannel(channelCode: string, userId: string): boolean {
    const channel = this.channels.get(channelCode);
    if (!channel) return false;

    const participant = channel.participants.get(userId);
    if (!participant) return false;

    channel.participants.delete(userId);
    channel.lastActivity = new Date();

    // Add system message
    this.addSystemMessage(channelCode, `${participant.username} left the channel`);

    // Remove channel if empty
    if (channel.participants.size === 0) {
      this.channels.delete(channelCode);
    }

    return true;
  }

  // Handle temporary disconnection (with grace period)
  handleDisconnect(channelCode: string, userId: string, username: string): void {
    // Store the disconnected user info
    this.disconnectedUsers.set(userId, {
      channelCode,
      userId,
      username,
      disconnectTime: Date.now()
    });

    // Don't immediately remove from channel - give grace period for reconnection
    console.log(`User ${username} (${userId}) temporarily disconnected from channel ${channelCode}`);
  }

  // Clean up users who haven't reconnected within grace period
  private cleanupDisconnectedUsers(): void {
    const now = Date.now();
    
    for (const [userId, disconnectInfo] of this.disconnectedUsers.entries()) {
      if (now - disconnectInfo.disconnectTime > this.DISCONNECT_GRACE_PERIOD) {
        // Remove from channel after grace period
        const success = this.leaveChannel(disconnectInfo.channelCode, disconnectInfo.userId);
        this.disconnectedUsers.delete(userId);
        
        if (success) {
          console.log(`User ${disconnectInfo.username} (${disconnectInfo.userId}) permanently left channel ${disconnectInfo.channelCode} after disconnect timeout`);
          
          // Emit user_left event to remaining users
          this.emitUserLeft(disconnectInfo.channelCode, disconnectInfo.userId, disconnectInfo.username);
        }
      }
    }
  }

  // Callback to emit events (will be set by socket server)
  private onUserLeftCallback?: (channelCode: string, userId: string, username: string) => void;

  setOnUserLeftCallback(callback: (channelCode: string, userId: string, username: string) => void): void {
    this.onUserLeftCallback = callback;
  }

  private emitUserLeft(channelCode: string, userId: string, username: string): void {
    if (this.onUserLeftCallback) {
      this.onUserLeftCallback(channelCode, userId, username);
    }
  }

  // Remove user from disconnected list when they reconnect
  handleReconnect(userId: string): void {
    if (this.disconnectedUsers.has(userId)) {
      this.disconnectedUsers.delete(userId);
      console.log(`User ${userId} reconnected within grace period`);
    }
  }

  addMessage(channelCode: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'channelCode'>): ChatMessage | null {
    const channel = this.channels.get(channelCode);
    if (!channel) return null;

    const chatMessage: ChatMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
      channelCode
    };

    channel.messages.push(chatMessage);
    channel.lastActivity = new Date();

    // Keep only last 100 messages per channel
    if (channel.messages.length > 100) {
      channel.messages = channel.messages.slice(-100);
    }

    return chatMessage;
  }

  private addSystemMessage(channelCode: string, text: string): void {
    this.addMessage(channelCode, {
      text,
      userId: 'system',
      username: 'System',
      encrypted: false,
      messageType: 'system'
    });
  }

  getChannelParticipants(channelCode: string): ChannelParticipant[] {
    const channel = this.channels.get(channelCode);
    if (!channel) return [];

    return Array.from(channel.participants.values());
  }

  getChannelMessages(channelCode: string, limit: number = 50): ChatMessage[] {
    const channel = this.channels.get(channelCode);
    if (!channel) return [];

    return channel.messages.slice(-limit);
  }

  setUserTyping(channelCode: string, userId: string, isTyping: boolean): boolean {
    const channel = this.channels.get(channelCode);
    if (!channel) return false;

    const participant = channel.participants.get(userId);
    if (!participant) return false;

    participant.isTyping = isTyping;
    return true;
  }

  private generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private cleanupInactiveChannels(): void {
    const now = new Date();
    
    for (const [code, channel] of this.channels.entries()) {
      const timeSinceLastActivity = now.getTime() - channel.lastActivity.getTime();
      
      // Remove channels that have been inactive for more than CHANNEL_EXPIRY
      if (timeSinceLastActivity > this.CHANNEL_EXPIRY) {
        this.channels.delete(code);
      }
    }
  }

  private cleanupOldestChannels(): void {
    const channelEntries = Array.from(this.channels.entries());
    
    // Sort by last activity (oldest first)
    channelEntries.sort(([, a], [, b]) => 
      a.lastActivity.getTime() - b.lastActivity.getTime()
    );

    // Remove oldest 10% of channels
    const toRemove = Math.floor(channelEntries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      const [code] = channelEntries[i];
      this.channels.delete(code);
    }
  }

  getChannelStats(): { totalChannels: number; totalParticipants: number } {
    let totalParticipants = 0;
    for (const channel of this.channels.values()) {
      totalParticipants += channel.participants.size;
    }

    return {
      totalChannels: this.channels.size,
      totalParticipants
    };
  }
}

// Export singleton instance
export const channelManager = new ChannelManager();
