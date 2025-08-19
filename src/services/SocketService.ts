import { io, Socket } from 'socket.io-client';
import { Notification } from '../types/Notification';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  // Mock server URL - replace with your actual server URL
  private serverUrl: string = 'https://your-server-url.com';
  
  // For development/testing, we'll use a mock implementation
  private useMock: boolean = true;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(): void {
    if (this.useMock) {
      this.startMockSocket();
      return;
    }

    try {
      this.socket = io(this.serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to connect to socket server:', error);
      this.startMockSocket();
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('notification', (data: Notification) => {
      console.log('Received notification via socket:', data);
      this.handleIncomingNotification(data);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to socket server after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Failed to reconnect to socket server');
      this.startMockSocket();
    });
  }

  private startMockSocket(): void {
    console.log('Starting mock socket service for development');
    this.isConnected = true;
    
    // Simulate real-time notifications
    this.simulateIncomingNotifications();
  }

  private simulateIncomingNotifications(): void {
    // Simulate notifications every 10-30 seconds
    const simulateNotification = () => {
      const mockNotifications = [
        {
          id: Date.now().toString(),
          title: 'New Message',
          message: 'You have a new message from a potential match!',
          type: 'info' as const,
          timestamp: new Date(),
          isRead: false,
          imageUrl: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=💬',
        },
        {
          id: Date.now().toString(),
          title: 'Profile View',
          message: 'Someone viewed your profile!',
          type: 'info' as const,
          timestamp: new Date(),
          isRead: false,
          imageUrl: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=👁️',
        },
        {
          id: Date.now().toString(),
          title: 'Match Alert',
          message: 'Congratulations! You have a new match!',
          type: 'success' as const,
          timestamp: new Date(),
          isRead: false,
          imageUrl: 'https://via.placeholder.com/50x50/FF5722/FFFFFF?text=🎉',
        },
      ];

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      this.handleIncomingNotification(randomNotification);
    };

    // Send first notification after 5 seconds
    setTimeout(simulateNotification, 5000);

    // Then send notifications randomly every 10-30 seconds
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to send notification
        simulateNotification();
      }
    }, 10000);
  }

  private handleIncomingNotification(notification: Notification): void {
    // Emit a custom event that the app can listen to
    const event = new CustomEvent('newNotification', { detail: notification });
    window.dispatchEvent(event);
    
    // In React Native, you might want to use a different approach
    // This is just for demonstration - in practice, you'd use a state management solution
    console.log('New notification received:', notification);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }

  emit(event: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.log('Socket not connected, cannot emit event:', event);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Method to switch between mock and real socket
  setUseMock(useMock: boolean): void {
    this.useMock = useMock;
    if (useMock) {
      this.disconnect();
      this.startMockSocket();
    } else {
      this.connect();
    }
  }
}

export const socketService = SocketService.getInstance();
