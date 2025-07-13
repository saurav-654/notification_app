/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, NativeModules, ScrollView, Alert, DeviceEventEmitter, TouchableOpacity, Animated } from 'react-native';
import messaging from '@react-native-firebase/messaging';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [slideAnim] = useState(new Animated.Value(0));
  const [notifications, setNotifications] = useState<any[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    // Load stored notifications on app start
    loadStoredNotifications();
    
    // Add connection status logging
    console.log('App started successfully');
    
    // Listen for FCM messages
    const messageListener = DeviceEventEmitter.addListener('FCMMessageReceived', (message) => {
      console.log('FCM Message received:', message);
      setLastMessage(message);
      Alert.alert(
        message.title || 'New Message',
        message.body || 'You have a new message'
      );
    });

    // Cleanup listeners
    return () => {
      messageListener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message received from messaging():', remoteMessage);
      const title = remoteMessage.notification?.title || 'New Message';
      const body = remoteMessage.notification?.body || 'You have a new message';
      
      const notificationData = {
        id: Date.now().toString(),
        title,
        body,
        data: remoteMessage.data,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Update lastMessage state
      setLastMessage(notificationData);
      
      // Store notification locally and update badge
      await storeNotification(notificationData);
      
      // Animate notification appearance
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    return unsubscribe;
  }, [slideAnim]);

  const loadStoredNotifications = async () => {
    try {
      // Simple in-memory storage for demo - in production use AsyncStorage
      const storedNotifications = await getStoredNotifications();
      setNotifications(storedNotifications);
      
      // Calculate unread count
      const unreadCount = storedNotifications.filter(notif => !notif.read).length;
      setBadgeCount(unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const storeNotification = async (notification: any) => {
    try {
      const updatedNotifications = [notification, ...notifications].slice(0, 50); // Keep last 50
      setNotifications(updatedNotifications);
      
      // Update badge count (only unread notifications)
      const unreadCount = updatedNotifications.filter(notif => !notif.read).length;
      setBadgeCount(unreadCount);
      
      // Store in local storage (simulated)
      await saveNotificationsToStorage(updatedNotifications);
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      setNotifications(updatedNotifications);
      
      // Update badge count
      const unreadCount = updatedNotifications.filter(notif => !notif.read).length;
      setBadgeCount(unreadCount);
      
      await saveNotificationsToStorage(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      setNotifications(updatedNotifications);
      setBadgeCount(0);
      await saveNotificationsToStorage(updatedNotifications);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      setNotifications(updatedNotifications);
      
      const unreadCount = updatedNotifications.filter(notif => !notif.read).length;
      setBadgeCount(unreadCount);
      
      await saveNotificationsToStorage(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
      setBadgeCount(0);
      await saveNotificationsToStorage([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Simple storage simulation (replace with AsyncStorage in production)
  const getStoredNotifications = async (): Promise<any[]> => {
    // Simulated stored notifications
    return [];
  };

  const saveNotificationsToStorage = async (notifications: any[]) => {
    // In production, use AsyncStorage.setItem('notifications', JSON.stringify(notifications))
    console.log('Notifications saved:', notifications.length);
  };

  const closeMessage = () => {
    if (lastMessage) {
      // Mark as read when closed
      markNotificationAsRead(lastMessage.id);
    }
    
    // Animate notification disappearance
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setLastMessage(null);
    });
  };

  const simulateBackendNotification = (type: string) => {
    let notificationData;
    
    switch (type) {
      case 'text':
        notificationData = {
          title: 'New Text Message 💬',
          body: 'You have received a new text message from John Doe',
          data: { screen: 'messages', senderId: '123', type: 'text_message' }
        };
        break;
      case 'voice':
        notificationData = {
          title: 'Incoming Voice Call 📞',
          body: 'John Doe is calling you...',
          data: { screen: 'voice_call', callerId: '123', type: 'voice_call' }
        };
        break;
      case 'video':
        notificationData = {
          title: 'Incoming Video Call 📹',
          body: 'John Doe wants to video chat with you',
          data: { screen: 'video_call', callerId: '123', type: 'video_call' }
        };
        break;
      default:
        notificationData = {
          title: 'Test Notification',
          body: `Backend simulation test at ${new Date().toLocaleTimeString()}`,
          data: { screen: 'notifications', test: 'true', timestamp: Date.now() }
        };
    }

    const notificationPayload = {
      id: Date.now().toString(),
      title: notificationData.title,
      body: notificationData.body,
      data: notificationData.data,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Simulate the notification
    setLastMessage(notificationPayload);
    
    // Store notification and update badge
    storeNotification(notificationPayload);
    
    // Animate notification appearance
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Remove Alert.alert for inline notification
    console.log('Backend simulation triggered:', notificationData);
  };

  const scheduledNotificationTest = () => {
    Alert.alert(
      'Scheduled Notification',
      'A notification will be triggered in 5 seconds',
      [{ text: 'OK' }]
    );

    setTimeout(() => {
      simulateBackendNotification('scheduled');
    }, 5000);
  };

  if (currentScreen === 'notifications') {
    const NotificationSummary = require('./screens/NotificationSummary').default;
    return (
      <NotificationSummary
        notifications={notifications}
        badgeCount={badgeCount}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
        onClearAll={clearAllNotifications}
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header with gradient-like effect */}
      <View style={styles.topHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>📱 Notification Hub</Text>
          {badgeCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.appSubtitle}>Stay connected with real-time updates</Text>
      </View>
      
      {/* Inline Notification Display */}
      {lastMessage && (
        <Animated.View 
          style={[
            styles.inlineNotificationContainer,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                })
              }],
              opacity: slideAnim,
            }
          ]}
        >
          <View style={styles.notificationBanner}>
            <View style={styles.notificationIconBanner}>
              <Text style={styles.notificationEmojiBanner}>
                {lastMessage.data?.type === 'voice_call' ? '📞' : 
                 lastMessage.data?.type === 'video_call' ? '📹' : '💬'}
              </Text>
            </View>
            <View style={styles.notificationContentBanner}>
              <Text style={styles.notificationTitleBanner}>{lastMessage.title}</Text>
              <Text style={styles.notificationBodyBanner}>{lastMessage.body}</Text>
            </View>
            <TouchableOpacity style={styles.closeButtonBanner} onPress={closeMessage}>
              <Text style={styles.closeButtonTextBanner}>×</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      
      <ScrollView 
        style={[
          styles.scrollView,
          lastMessage && { marginTop: 10 } // Add margin when notification is visible
        ]} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
          <Text style={styles.headerTitle}>Welcome to Your Notification Center</Text>
          <Text style={styles.headerDescription}>
            Receive and manage all your important notifications in one place
          </Text>
        </View>

        {/* Backend Simulation Controls */}
        <View style={styles.simulationContainer}>
          <View style={styles.simulationHeader}>
            <Text style={styles.simulationTitle}>🛠️ Communication Test</Text>
            <TouchableOpacity style={styles.notificationsButton} onPress={viewAllNotifications}>
              <Text style={styles.notificationsButtonText}>
                📋 View All ({badgeCount})
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.simulationSubtitle}>Simulate different notification types</Text>
          
          <View style={styles.buttonGrid}>
            <TouchableOpacity 
              style={[styles.simButton, styles.textButton]} 
              onPress={() => simulateBackendNotification('text')}
            >
              <Text style={styles.simButtonEmoji}>💬</Text>
              <Text style={styles.simButtonText}>Text Message</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.simButton, styles.voiceButton]} 
              onPress={() => simulateBackendNotification('voice')}
            >
              <Text style={styles.simButtonEmoji}>📞</Text>
              <Text style={styles.simButtonText}>Voice Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.simButton, styles.videoButton]} 
              onPress={() => simulateBackendNotification('video')}
            >
              <Text style={styles.simButtonEmoji}>📹</Text>
              <Text style={styles.simButtonText}>Video Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification History Summary */}
        {notifications.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>📊 Notification Summary</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{notifications.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.unreadNumber]}>{badgeCount}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.readNumber]}>{notifications.length - badgeCount}</Text>
                <Text style={styles.statLabel}>Read</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ Created by Saurav Agrawal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  topHeader: {
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FFF3E0',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  bellIcon: {
    fontSize: 35,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  messageContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#27AE60',
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  messageIcon: {
    backgroundColor: '#E8F8F5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  messageEmoji: {
    fontSize: 25,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  closeButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  messageInfo: {
    marginBottom: 10,
  },
  messageSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2C3E50',
  },
  messageBody: {
    fontSize: 15,
    marginBottom: 8,
    color: '#34495E',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 13,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  dataContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6C757D',
    lineHeight: 16,
  },
  emptyStateContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    alignItems: 'center',
    borderRadius: 15,
   
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 14,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  simulationContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  simulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 5,
  },
  simulationSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  simButton: {
    width: '30%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textButton: {
    backgroundColor: '#3498DB',
  },
  voiceButton: {
    backgroundColor: '#27AE60',
  },
  videoButton: {
    backgroundColor: '#E74C3C',
  },
  simButtonEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  simButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inlineNotificationContainer: {
    position: 'absolute',
    top: 120, // Just below the header
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 15,
  },
  notificationBanner: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  notificationIconBanner: {
    backgroundColor: '#E3F2FD',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationEmojiBanner: {
    fontSize: 20,
  },
  notificationContentBanner: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitleBanner: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  notificationBodyBanner: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  closeButtonBanner: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonTextBanner: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    right: -30,
    top: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationsButton: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  notificationsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  unreadNumber: {
    color: '#E74C3C',
  },
  readNumber: {
    color: '#27AE60',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: '#E67E22',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
