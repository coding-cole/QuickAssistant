import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, message.isUser ? styles.userContainer : styles.aiContainer]}>
      {!message.isUser && (
        <View style={styles.avatarContainer}>
          <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
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
      </View>
      {message.isUser && (
        <View style={[styles.avatarContainer, styles.userAvatar]}>
          <Ionicons name="person" size={16} color={theme.colors.background} />
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'flex-end',
    },
    userContainer: {
      justifyContent: 'flex-end',
    },
    aiContainer: {
      justifyContent: 'flex-start',
    },
    avatarContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 2,
    },
    userAvatar: {
      backgroundColor: theme.colors.primary,
    },
    bubble: {
      maxWidth: '75%',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    userBubble: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 4,
      marginRight: theme.spacing.sm,
    },
    aiBubble: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: 4,
      marginLeft: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    userText: {
      color: theme.colors.background,
    },
    aiText: {
      color: theme.colors.text,
    },
  });
