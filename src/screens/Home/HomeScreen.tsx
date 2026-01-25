import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { ChatMessage, ChatInput, Message } from '@components/chat';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  text: "Hello! I'm your QuickAssistant. How can I help you today?",
  isUser: false,
  timestamp: new Date(),
};

const AI_RESPONSES = [
  "That's a great question! Let me help you with that.",
  "I understand what you're looking for. Here's what I think...",
  "Thanks for sharing that with me. Based on what you've said...",
  "Interesting! I'd be happy to assist you with this.",
  "Let me think about that for a moment... Here's my suggestion:",
  "Great point! Here's how I can help you with that.",
];

const HomeScreen: React.FC = () => {
  const { theme, toggleTheme, themeMode } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getThemeModeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (themeMode) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      default:
        return 'phone-portrait-outline';
    }
  };

  const simulateAIResponse = useCallback(() => {
    setIsTyping(true);
    setTimeout(
      () => {
        const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    );
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      simulateAIResponse();
    },
    [simulateAIResponse]
  );

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    return <ChatMessage message={item} />;
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={20} color={theme.colors.background} />
          </View>
          <View>
            <Typography variant="h4">QuickAssistant</Typography>
            <Typography variant="caption" color="secondary">
              {isTyping ? 'Typing...' : 'Online'}
            </Typography>
          </View>
        </View>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={toggleTheme}
          accessibilityLabel={`Current theme: ${themeMode}. Tap to change.`}
        >
          <Ionicons name={getThemeModeIcon()} size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDotMiddle]} />
                <View style={styles.typingDot} />
              </View>
            ) : null
          }
        />
        <ChatInput onSend={handleSend} disabled={isTyping} placeholder="Ask me anything..." />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    aiAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.surface,
    },
    chatContainer: {
      flex: 1,
    },
    messageList: {
      paddingVertical: theme.spacing.md,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      marginLeft: theme.spacing.md + 28 + theme.spacing.sm,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textSecondary,
      marginHorizontal: 2,
      opacity: 0.4,
    },
    typingDotMiddle: {
      opacity: 0.7,
    },
  });

export default HomeScreen;
