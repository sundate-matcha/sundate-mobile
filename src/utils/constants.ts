export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Background colors
  background: '#f5f5f5',
  surface: '#ffffff',
  card: '#ffffff',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Border colors
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  
  // Status colors
  online: '#4CAF50',
  offline: '#9E9E9E',
  busy: '#FF5722',
};

export const SIZES = {
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  
  // Border radius
  radius: 8,
  radiusLg: 12,
  radiusXl: 16,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NOTIFICATION: 'notification',
  MESSAGE: 'message',
  MATCH: 'match',
  PROFILE_VIEW: 'profile_view',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: 'https://your-api-url.com',
  NOTIFICATIONS: '/notifications',
  USERS: '/users',
  MATCHES: '/matches',
  MESSAGES: '/messages',
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PREFERENCES: 'user_preferences',
  NOTIFICATION_SETTINGS: 'notification_settings',
  APP_SETTINGS: 'app_settings',
} as const;
