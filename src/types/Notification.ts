export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}
