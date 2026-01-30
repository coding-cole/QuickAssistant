import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Theme } from '@theme';
import { Typography, NotificationCard, Notification } from '@components/common';
import { mockNotifications } from '@utils/mock/data';

const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setNotifications(mockNotifications);
    setIsRefreshing(false);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isUnread: false } : n))
      );

      // Navigate based on type
      switch (notification.type) {
        case 'event':
          // Navigate to calendar or event details
          break;
        case 'reminder':
          // Navigate to scheduled ride details
          break;
        case 'alert':
          // Navigate to map or traffic details
          break;
      }
    },
    [navigation]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Typography
            variant="bodySmall"
            style={[styles.actionText, unreadCount === 0 && styles.actionTextDisabled]}
          >
            Mark all as read
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearAll}
          disabled={notifications.length === 0}
        >
          <Typography
            variant="bodySmall"
            style={[
              styles.actionText,
              styles.actionTextDanger,
              notifications.length === 0 && styles.actionTextDisabled,
            ]}
          >
            Clear all
          </Typography>
        </TouchableOpacity>
      </View>
    ),
    [unreadCount, notifications.length, handleMarkAllAsRead, handleClearAll, styles]
  );

  const renderNotification = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard
        type={item.type}
        title={item.title}
        description={item.description}
        timestamp={item.timestamp}
        isUnread={item.isUnread}
        onPress={() => handleNotificationPress(item)}
      />
    ),
    [handleNotificationPress]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textDisabled} />
        <Typography variant="h4" style={styles.emptyTitle}>
          No notifications
        </Typography>
        <Typography variant="body" color="secondary" style={styles.emptySubtitle}>
          You're all caught up! Check back later for updates.
        </Typography>
      </View>
    ),
    [styles, theme]
  );

  // Sort notifications with unread first
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.isUnread && !b.isUnread) return -1;
      if (!a.isUnread && b.isUnread) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header with unread badge */}
      <View style={styles.headerInfo}>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Typography variant="caption" style={styles.unreadBadgeText}>
              {unreadCount} new
            </Typography>
          </View>
        )}
      </View>

      {renderHeader()}

      <FlatList
        data={sortedNotifications}
        renderItem={renderNotification}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    unreadBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    unreadBadgeText: {
      color: theme.colors.background,
      fontWeight: theme.fontWeight.semiBold,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    actionButton: {
      padding: theme.spacing.sm,
    },
    actionText: {
      color: theme.colors.primary,
    },
    actionTextDanger: {
      color: theme.colors.error,
    },
    actionTextDisabled: {
      color: theme.colors.textDisabled,
    },
    listContent: {
      padding: theme.spacing.md,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    emptyTitle: {
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    emptySubtitle: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });

export default NotificationsScreen;
