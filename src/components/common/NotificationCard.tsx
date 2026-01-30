import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from './Typography';
import { palette } from '@theme/colors';

export type NotificationType = 'event' | 'reminder' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
}

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isUnread?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getTypeConfig = (type: NotificationType) => {
  switch (type) {
    case 'event':
      return {
        icon: 'calendar-outline' as const,
        backgroundColor: palette.primary100,
        iconColor: palette.primary500,
      };
    case 'reminder':
      return {
        icon: 'time-outline' as const,
        backgroundColor: palette.primary100,
        iconColor: palette.primary500,
      };
    case 'alert':
      return {
        icon: 'warning-outline' as const,
        backgroundColor: '#FFF3E0',
        iconColor: palette.warning,
      };
    default:
      return {
        icon: 'notifications-outline' as const,
        backgroundColor: palette.gray100,
        iconColor: palette.gray600,
      };
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  description,
  timestamp,
  isUnread = false,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const typeConfig = getTypeConfig(type);

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${isUnread ? 'Unread ' : ''}${type} notification: ${title}`}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}>
          <Ionicons name={typeConfig.icon} size={20} color={typeConfig.iconColor} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Typography variant="body" style={styles.title} numberOfLines={1}>
              {title}
            </Typography>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Typography
            variant="bodySmall"
            color="secondary"
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.timestamp}>
            {formatTimestamp(timestamp)}
          </Typography>
        </View>
      </View>
    </CardWrapper>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontWeight: theme.fontWeight.bold,
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    description: {
      marginTop: 2,
    },
    timestamp: {
      marginTop: 4,
    },
  });
