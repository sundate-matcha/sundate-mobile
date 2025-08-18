import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Notification, PushNotificationData } from '../types/Notification';

export class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | undefined;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    this.pushToken = token?.data;
    return token?.data;
  }

  async scheduleLocalNotification(notification: PushNotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
      trigger: null, // Send immediately
    });
  }

  async scheduleDelayedNotification(
    notification: PushNotificationData, 
    delaySeconds: number
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
      trigger: {
        seconds: delaySeconds,
      },
    });
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  getPushToken(): string | undefined {
    return this.pushToken;
  }

  // Mock method to simulate receiving notifications
  async getMockNotifications(): Promise<Notification[]> {
    return [
      {
        id: '1',
        title: 'Welcome to SunDate!',
        message: 'Thank you for joining our community. We\'re excited to have you on board!',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        imageUrl: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=SD',
      },
      {
        id: '2',
        title: 'New Match Available',
        message: 'Someone in your area is interested in connecting with you!',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        imageUrl: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=❤️',
      },
      {
        id: '3',
        title: 'Profile Update Reminder',
        message: 'Keep your profile fresh! Consider adding new photos or updating your bio.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        imageUrl: 'https://via.placeholder.com/50x50/FF9800/FFFFFF?text=📝',
      },
      {
        id: '4',
        title: 'Weekly Summary',
        message: 'You had 5 new profile views and 2 new matches this week!',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
        isRead: true,
        imageUrl: 'https://via.placeholder.com/50x50/9C27B0/FFFFFF?text=📊',
      },
    ];
  }

  async markAsRead(notificationId: string): Promise<void> {
    // In a real app, this would update the backend
    console.log(`Marking notification ${notificationId} as read`);
  }

  async markAllAsRead(): Promise<void> {
    // In a real app, this would update the backend
    console.log('Marking all notifications as read');
  }
}

export const notificationService = NotificationService.getInstance();
