import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  List,
  Divider,
  Chip,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types/User';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=JD',
    preferences: {
      pushNotifications: true,
      emailNotifications: false,
      notificationTypes: ['matches', 'messages', 'profile_views'],
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editedName,
      email: editedEmail,
    }));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setIsEditing(false);
  };

  const togglePushNotifications = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        pushNotifications: !prev.preferences.pushNotifications,
      },
    }));
  };

  const toggleEmailNotifications = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        emailNotifications: !prev.preferences.emailNotifications,
      },
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          },
        },
      ]
    );
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'matches':
        return 'New Matches';
      case 'messages':
        return 'New Messages';
      case 'profile_views':
        return 'Profile Views';
      case 'likes':
        return 'New Likes';
      default:
        return type;
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'matches':
        return 'heart';
      case 'messages':
        return 'chatbubble';
      case 'profile_views':
        return 'eye';
      case 'likes':
        return 'thumbs-up';
      default:
        return 'notifications';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={100}
            source={{ uri: user.avatar }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.editInput}
                  mode="outlined"
                  dense
                />
                <TextInput
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  style={styles.editInput}
                  mode="outlined"
                  dense
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Title style={styles.profileName}>{user.name}</Title>
                <Paragraph style={styles.profileEmail}>{user.email}</Paragraph>
              </>
            )}
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.profileActions}>
          {isEditing ? (
            <View style={styles.editActions}>
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.actionButton}
                icon="check"
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={styles.actionButton}
                icon="close"
              >
                Cancel
              </Button>
            </View>
          ) : (
            <Button
              mode="outlined"
              onPress={() => setIsEditing(true)}
              icon="create"
            >
              Edit Profile
            </Button>
          )}
        </View>

        {/* Notification Preferences */}
        <Card style={styles.preferencesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification Preferences</Title>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="notifications" size={24} color="#007AFF" />
                <View style={styles.preferenceText}>
                  <Paragraph style={styles.preferenceLabel}>Push Notifications</Paragraph>
                  <Paragraph style={styles.preferenceDescription}>
                    Receive notifications on your device
                  </Paragraph>
                </View>
              </View>
              <Switch
                value={user.preferences.pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={user.preferences.pushNotifications ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="mail" size={24} color="#007AFF" />
                <View style={styles.preferenceText}>
                  <Paragraph style={styles.preferenceLabel}>Email Notifications</Paragraph>
                  <Paragraph style={styles.preferenceDescription}>
                    Receive notifications via email
                  </Paragraph>
                </View>
              </View>
              <Switch
                value={user.preferences.emailNotifications}
                onValueChange={toggleEmailNotifications}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={user.preferences.emailNotifications ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Notification Types */}
        <Card style={styles.preferencesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification Types</Title>
            <Paragraph style={styles.cardDescription}>
              Choose which types of notifications you want to receive
            </Paragraph>
            
            <View style={styles.notificationTypes}>
              {user.preferences.notificationTypes.map((type) => (
                <Chip
                  key={type}
                  icon={() => (
                    <Ionicons
                      name={getNotificationTypeIcon(type) as any}
                      size={16}
                      color="#007AFF"
                    />
                  )}
                  style={styles.typeChip}
                  mode="outlined"
                >
                  {getNotificationTypeLabel(type)}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.preferencesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>App Settings</Title>
            
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content would go here.')}
            />
            
            <Divider />
            
            <List.Item
              title="Terms of Service"
              description="Read our terms of service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service content would go here.')}
            />
            
            <Divider />
            
            <List.Item
              title="About SunDate"
              description="Learn more about our app"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('About SunDate', 'SunDate is a modern dating app focused on meaningful connections.')}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="log-out-outline"
            style={styles.logoutButton}
            textColor="#FF5722"
          >
            Logout
          </Button>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Paragraph style={styles.versionText}>Version 1.0.0</Paragraph>
        </View>
      </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileAvatar: {
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  editInput: {
    marginBottom: 10,
    width: 200,
  },
  profileActions: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  preferencesCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    marginLeft: 15,
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 5,
  },
  notificationTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  typeChip: {
    marginBottom: 5,
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    borderColor: '#FF5722',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});
