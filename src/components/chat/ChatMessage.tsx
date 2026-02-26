import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { palette } from '@theme/colors';
import { formatTime } from '@utils/formatters';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'transport-options';
  actionLabel?: string;
  onActionPress?: () => void;
}

interface ChatMessageProps {
  message: Message;
  userInitials?: string;
  showTimestamp?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, showTimestamp = false }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, message.isUser ? styles.userContainer : styles.aiContainer]}>
        {!message.isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="hardware-chip-outline" size={16} color={theme.colors.primary} />
          </View>
        )}
        <View
          style={[styles.bubble, message.isUser ? styles.userBubble : styles.aiBubble]}
          accessibilityRole="text"
          accessibilityLabel={`${message.isUser ? 'You' : 'Assistant'}: ${message.text}`}
        >
          <Typography variant="body" style={message.isUser ? styles.userText : styles.aiText}>
            {message.text}
          </Typography>
          {!message.isUser && message.actionLabel && message.onActionPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={message.onActionPress}
              activeOpacity={0.8}
            >
              <Ionicons name="car-outline" size={16} color={palette.white} />
              <Typography variant="bodySmall" style={styles.actionButtonText}>
                {message.actionLabel}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
        {message.isUser && (
          <View style={[styles.avatarContainer, styles.userAvatar]}>
            <Ionicons name="person-circle-outline" size={20} color={styles.userIcon.color} />
          </View>
        )}
      </View>
      {showTimestamp && (
        <View
          style={[
            styles.timestampContainer,
            message.isUser ? styles.timestampRight : styles.timestampLeft,
          ]}
        >
          <Typography variant="caption" color="secondary">
            {formatTime(message.timestamp)}
          </Typography>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginVertical: theme.spacing.xs,
    },
    container: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'flex-end',
    },
    userContainer: {
      justifyContent: 'flex-end',
    },
    aiContainer: {
      justifyContent: 'flex-start',
    },
    avatarContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    userAvatar: {
      backgroundColor: '#F5E6D3', // Beige/cream background for user
      borderColor: '#E8D4C0',
    },
    userIcon: {
      color: '#8B7355',
    },
    bubble: {
      maxWidth: '75%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: theme.colors.primary,
      borderTopRightRadius: 4,
      marginRight: theme.spacing.sm,
    },
    aiBubble: {
      backgroundColor: palette.gray100,
      borderTopLeftRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    userText: {
      color: palette.white,
    },
    aiText: {
      color: palette.gray900,
    },
    timestampContainer: {
      paddingHorizontal: theme.spacing.sm,
      marginTop: 4,
    },
    timestampRight: {
      alignItems: 'flex-end',
      paddingRight: 48,
    },
    timestampLeft: {
      alignItems: 'flex-start',
      paddingLeft: 48,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 10,
      alignSelf: 'flex-start',
      gap: 6,
    },
    actionButtonText: {
      color: palette.white,
      fontWeight: '600',
    },
  });
