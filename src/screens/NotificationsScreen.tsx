import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  Searchbar,
  FAB,
  Divider,
  Badge,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../services/NotificationService';
import { Notification } from '../types/Notification';

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, selectedFilter]);

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

  const filterNotifications = () => {
    let filtered = notifications;

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleNotificationPress = (notification: Notification) => {
    navigation.navigate('NotificationDetail', { notification });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All',
          onPress: async () => {
            try {
              await notificationService.markAllAsRead();
              setNotifications(prev => 
                prev.map(n => ({ ...n, isRead: true }))
              );
              setUnreadCount(0);
            } catch (error) {
              console.error('Failed to mark all notifications as read:', error);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
            setFilteredNotifications([]);
            setUnreadCount(0);
          },
        },
      ]
    );
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

  const renderNotification = ({ item }: { item: Notification }) => (
    <Card
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.notificationHeader}>
          <Avatar.Image
            size={50}
            source={{ uri: item.imageUrl }}
            style={styles.notificationAvatar}
          />
          <View style={styles.notificationInfo}>
            <Title style={styles.notificationTitle}>
              {item.title}
            </Title>
            <Paragraph style={styles.notificationTime}>
              {formatTimeAgo(item.timestamp)}
            </Paragraph>
          </View>
          <View style={styles.notificationMeta}>
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={24}
              color={getNotificationColor(item.type)}
            />
            <Chip
              mode="outlined"
              textStyle={{ fontSize: 10 }}
              style={[
                styles.typeChip,
                { borderColor: getNotificationColor(item.type) }
              ]}
            >
              {item.type}
            </Chip>
          </View>
        </View>
        <Paragraph style={styles.notificationMessage} numberOfLines={3}>
          {item.message}
        </Paragraph>
        {!item.isRead && (
          <View style={styles.notificationActions}>
            <Button
              mode="text"
              onPress={() => handleMarkAsRead(item.id)}
              compact
              icon="check"
            >
              Mark as Read
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off" size={64} color="#ccc" />
      <Title style={styles.emptyStateTitle}>No Notifications</Title>
      <Paragraph style={styles.emptyStateText}>
        {searchQuery || selectedFilter !== 'all'
          ? 'No notifications match your current filters.'
          : 'You\'re all caught up! Check back later for new updates.'
        }
      </Paragraph>
      {(searchQuery || selectedFilter !== 'all') && (
        <Button
          mode="outlined"
          onPress={() => {
            setSearchQuery('');
            setSelectedFilter('all');
          }}
        >
          Clear Filters
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Notifications</Title>
        <View style={styles.headerActions}>
          <Badge visible={unreadCount > 0} size={24}>
            {unreadCount}
          </Badge>
          <Button
            mode="text"
            onPress={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            icon="check-all"
          >
            Mark All
          </Button>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search notifications..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
            mode="outlined"
          >
            All ({notifications.length})
          </Chip>
          <Chip
            selected={selectedFilter === 'info'}
            onPress={() => setSelectedFilter('info')}
            style={styles.filterChip}
            mode="outlined"
          >
            Info
          </Chip>
          <Chip
            selected={selectedFilter === 'success'}
            onPress={() => setSelectedFilter('success')}
            style={styles.filterChip}
            mode="outlined"
          >
            Success
          </Chip>
          <Chip
            selected={selectedFilter === 'warning'}
            onPress={() => setSelectedFilter('warning')}
            style={styles.filterChip}
            mode="outlined"
          >
            Warning
          </Chip>
          <Chip
            selected={selectedFilter === 'error'}
            onPress={() => setSelectedFilter('error')}
            style={styles.filterChip}
            mode="outlined"
          >
            Error
          </Chip>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <FAB
          style={[styles.fab, styles.fabSecondary]}
          icon="delete-sweep"
          onPress={handleClearAll}
          disabled={notifications.length === 0}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => Alert.alert('FAB', 'Add new notification or action')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    marginRight: 10,
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    padding: 20,
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
  notificationActions: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  separator: {
    height: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 16,
  },
  fab: {
    backgroundColor: '#007AFF',
  },
  fabSecondary: {
    backgroundColor: '#FF5722',
  },
});
