import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Chip,
  Divider,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../services/NotificationService';
import { Notification } from '../types/Notification';

export default function NotificationDetailScreen({ route, navigation }: any) {
  const { notification }: { notification: Notification } = route.params;
  const [isRead, setIsRead] = useState(notification.isRead);

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAsRead(notification.id);
      setIsRead(true);
      Alert.alert('Success', 'Notification marked as read!');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read.');
    }
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      Linking.openURL(notification.actionUrl).catch(() => {
        Alert.alert('Error', 'Could not open the link.');
      });
    } else {
      Alert.alert('No Action', 'This notification has no associated action.');
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would be implemented here.');
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

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationPriority = (type: string) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Notification Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Avatar.Image
                size={80}
                source={{ uri: notification.imageUrl }}
                style={styles.notificationAvatar}
              />
              <View style={styles.headerInfo}>
                <Title style={styles.notificationTitle}>
                  {notification.title}
                </Title>
                <View style={styles.headerMeta}>
                  <Chip
                    mode="outlined"
                    textStyle={{ fontSize: 12 }}
                    style={[
                      styles.typeChip,
                      { borderColor: getNotificationColor(notification.type) }
                    ]}
                  >
                    {notification.type.toUpperCase()}
                  </Chip>
                  <Chip
                    mode="outlined"
                    textStyle={{ fontSize: 12 }}
                    style={styles.priorityChip}
                  >
                    {getNotificationPriority(notification.type)}
                  </Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Notification Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            <Title style={styles.contentTitle}>Message</Title>
            <Paragraph style={styles.notificationMessage}>
              {notification.message}
            </Paragraph>
            
            {notification.data && Object.keys(notification.data).length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Title style={styles.contentTitle}>Additional Data</Title>
                <View style={styles.dataContainer}>
                  {Object.entries(notification.data).map(([key, value]) => (
                    <View key={key} style={styles.dataItem}>
                      <Paragraph style={styles.dataKey}>{key}:</Paragraph>
                      <Paragraph style={styles.dataValue}>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Paragraph>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Notification Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.contentTitle}>Details</Title>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="time" size={20} color="#666" />
              </View>
              <View style={styles.detailContent}>
                <Paragraph style={styles.detailLabel}>Timestamp</Paragraph>
                <Paragraph style={styles.detailValue}>
                  {formatTimestamp(notification.timestamp)}
                </Paragraph>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="eye" size={20} color="#666" />
              </View>
              <View style={styles.detailContent}>
                <Paragraph style={styles.detailLabel}>Status</Paragraph>
                <Paragraph style={styles.detailValue}>
                  {isRead ? 'Read' : 'Unread'}
                </Paragraph>
              </View>
            </View>

            {notification.actionUrl && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="link" size={20} color="#666" />
                  </View>
                  <View style={styles.detailContent}>
                    <Paragraph style={styles.detailLabel}>Action URL</Paragraph>
                    <Paragraph style={styles.detailValue} numberOfLines={2}>
                      {notification.actionUrl}
                    </Paragraph>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {!isRead && (
            <Button
              mode="contained"
              onPress={handleMarkAsRead}
              style={styles.actionButton}
              icon="check"
            >
              Mark as Read
            </Button>
          )}
          
          {notification.actionUrl && (
            <Button
              mode="outlined"
              onPress={handleAction}
              style={styles.actionButton}
              icon="open-in-new"
            >
              Take Action
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.actionButton}
            icon="share"
          >
            Share
          </Button>
        </View>

        {/* Related Actions */}
        <Card style={styles.relatedCard}>
          <Card.Content>
            <Title style={styles.contentTitle}>Related Actions</Title>
            
            <View style={styles.relatedActions}>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Notifications')}
                icon="arrow-back"
                style={styles.relatedButton}
              >
                Back to Notifications
              </Button>
              
              <Button
                mode="text"
                onPress={() => navigation.navigate('Home')}
                icon="home"
                style={styles.relatedButton}
              >
                Go to Home
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="heart"
        onPress={() => Alert.alert('Like', 'You liked this notification!')}
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
  headerCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationAvatar: {
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  typeChip: {
    height: 24,
  },
  priorityChip: {
    height: 24,
    borderColor: '#666',
  },
  contentCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  divider: {
    marginVertical: 15,
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  dataItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 80,
  },
  dataValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailsCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    padding: 20,
    gap: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
  relatedCard: {
    margin: 20,
    marginBottom: 20,
    elevation: 2,
  },
  relatedActions: {
    gap: 10,
  },
  relatedButton: {
    justifyContent: 'flex-start',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5722',
  },
});
