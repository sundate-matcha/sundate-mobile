import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Badge,
  Avatar,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../services/NotificationService';
import { socketService } from '../services/SocketService';
import { Notification } from '../types/Notification';

export default function HomeScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Listen for new notifications from socket
    const handleNewNotification = (event: any) => {
      const newNotification = event.detail;
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // For React Native, we'll use a different approach
    // This is just for demonstration
    if (typeof window !== 'undefined') {
      window.addEventListener('newNotification', handleNewNotification);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('newNotification', handleNewNotification);
      }
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const mockNotifications = await notificationService.getMockNotifications();
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    navigation.navigate('NotificationDetail', { notification });
  };

  const handleTestNotification = () => {
    notificationService.scheduleLocalNotification({
      title: 'Test Notification',
      body: 'This is a test notification from the app!',
      data: { screen: 'Home' },
    });
    Alert.alert('Success', 'Test notification scheduled!');
  };

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Title style={styles.welcomeText}>Welcome to SunDate</Title>
            <Paragraph style={styles.subtitleText}>
              Your dating journey starts here
            </Paragraph>
          </View>
          <View style={styles.headerActions}>
            <Badge visible={unreadCount > 0} size={24}>
              {unreadCount}
            </Badge>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Notifications')}
              icon="bell"
            >
              Notifications
            </Button>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleTestNotification}
              style={styles.actionButton}
              icon="bell-ring"
            >
              Test Notification
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Profile')}
              style={styles.actionButton}
              icon="account-edit"
            >
              Edit Profile
            </Button>
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.recentNotifications}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Notifications</Title>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Notifications')}
              compact
            >
              View All
            </Button>
          </View>
          
          {notifications.slice(0, 3).map((notification) => (
            <Card
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadCard
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.notificationHeader}>
                  <Avatar.Image
                    size={40}
                    source={{ uri: notification.imageUrl }}
                    style={styles.notificationAvatar}
                  />
                  <View style={styles.notificationInfo}>
                    <Title style={styles.notificationTitle}>
                      {notification.title}
                    </Title>
                    <Paragraph style={styles.notificationTime}>
                      {formatTimeAgo(notification.timestamp)}
                    </Paragraph>
                  </View>
                  <View style={styles.notificationMeta}>
                    <Ionicons
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                    <Chip
                      mode="outlined"
                      textStyle={{ fontSize: 10 }}
                      style={[
                        styles.typeChip,
                        { borderColor: getNotificationColor(notification.type) }
                      ]}
                    >
                      {notification.type}
                    </Chip>
                  </View>
                </View>
                <Paragraph style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <Card style={styles.statusCard}>
            <Card.Content>
              <View style={styles.statusRow}>
                <Ionicons
                  name={socketService.isSocketConnected() ? 'wifi' : 'wifi-outline'}
                  size={20}
                  color={socketService.isSocketConnected() ? '#4CAF50' : '#9E9E9E'}
                />
                <Paragraph style={styles.statusText}>
                  {socketService.isSocketConnected() 
                    ? 'Real-time notifications active' 
                    : 'Connecting to server...'
                  }
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => Alert.alert('FAB', 'Add new content or action')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  headerActions: {
    alignItems: 'center',
  },
  quickActions: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  recentNotifications: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  notificationCard: {
    marginBottom: 10,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    backgroundColor: '#f8f9ff',
  },
  cardContent: {
    paddingVertical: 15,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationAvatar: {
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMeta: {
    alignItems: 'center',
    gap: 5,
  },
  typeChip: {
    height: 20,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  connectionStatus: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  statusCard: {
    elevation: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});
