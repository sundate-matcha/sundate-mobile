export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    notificationTypes: string[];
  };
}
