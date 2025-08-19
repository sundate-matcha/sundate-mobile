import { Notification } from '../types/Notification';

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export const formatTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

/**
 * Format timestamp to readable date format
 */
export const formatDate = (timestamp: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'long') {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return 'checkmark-circle';
    case 'warning':
      return 'warning';
    case 'error':
      return 'close-circle';
    default:
      return 'information-circle';
  }
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'success':
      return '#4CAF50';
    case 'warning':
      return '#FF9800';
    case 'error':
      return '#F44336';
    default:
      return '#2196F3';
  }
};

/**
 * Get notification priority based on type
 */
export const getNotificationPriority = (type: string): string => {
  switch (type) {
    case 'error':
      return 'High';
    case 'warning':
      return 'Medium';
    case 'success':
      return 'Low';
    default:
      return 'Normal';
  }
};

/**
 * Filter notifications by type
 */
export const filterNotificationsByType = (
  notifications: Notification[],
  type: string
): Notification[] => {
  if (type === 'all') return notifications;
  return notifications.filter(n => n.type === type);
};

/**
 * Search notifications by text
 */
export const searchNotifications = (
  notifications: Notification[],
  query: string
): Notification[] => {
  if (!query.trim()) return notifications;
  
  const lowercaseQuery = query.toLowerCase();
  return notifications.filter(n => 
    n.title.toLowerCase().includes(lowercaseQuery) ||
    n.message.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Sort notifications by timestamp (newest first)
 */
export const sortNotificationsByDate = (
  notifications: Notification[],
  ascending: boolean = false
): Notification[] => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.isRead).length;
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.timestamp);
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
  });
  
  return Object.entries(groups).map(([date, notifications]) => ({
    date,
    notifications: sortNotificationsByDate(notifications),
  }));
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
