import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme, Theme } from '@theme';
import { TransportCard, TransportOption } from '@components/common';
import { ChatMessage, ChatInput, Message } from '@components/chat';
import { HomeStackParamList } from '@app-types/navigation.types';
import { groqService } from '@services/ai';

type ChatScreenRouteProp = RouteProp<HomeStackParamList, 'Chat'>;

interface ExtendedMessage extends Message {
  transportOptions?: TransportOption[];
}

const getWelcomeMessage = (): ExtendedMessage => ({
  id: 'welcome',
  text: `Hello! I'm QuickAssistant, your AI-powered mobility companion for Lagos. Where would you like to go today?`,
  isUser: false,
  timestamp: new Date(),
});

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { initialQuery } = route.params || {};

  // Set welcome message on mount
  useEffect(() => {
    setMessages([getWelcomeMessage()]);
  }, []);

  // Handle initial query from navigation
  useEffect(() => {
    if (initialQuery) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        handleSend(initialQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  const addMessage = useCallback((message: ExtendedMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: ExtendedMessage = {
        id: `user-${Date.now()}`,
        text,
        isUser: true,
        timestamp: new Date(),
      };
      addMessage(userMessage);
      setIsTyping(true);

      try {
        // Get AI response
        const response = await groqService.sendMessage(text);

        if (response.success) {
          // Add AI response
          const aiMessage: ExtendedMessage = {
            id: `ai-${Date.now()}`,
            text: response.message,
            isUser: false,
            timestamp: new Date(),
          };

          addMessage(aiMessage);

          // Debug logging
          console.warn('AI Response:', {
            hasMetadata: !!response.metadata,
            hasTransportOptions: response.metadata?.hasTransportOptions,
            transportOptionsCount: response.metadata?.transportOptions?.length,
          });

          // If AI provided transport options in metadata, show them
          if (response.metadata?.hasTransportOptions && response.metadata?.transportOptions) {
            console.warn('Showing transport options:', response.metadata.transportOptions.length);
            setTimeout(() => {
              addMessage({
                id: `ai-options-${Date.now()}`,
                text: '',
                isUser: false,
                timestamp: new Date(),
                transportOptions: response.metadata!.transportOptions,
              });
            }, 500);
          }
        } else {
          // Error response
          addMessage({
            id: `ai-error-${Date.now()}`,
            text: response.error || "I'm having trouble connecting. Please try again.",
            isUser: false,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error('Chat error:', error);
        addMessage({
          id: `ai-error-${Date.now()}`,
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        });
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage]
  );

  const handleBookPress = useCallback(
    (option: TransportOption) => {
      addMessage({
        id: `user-${Date.now()}`,
        text: `Book ${option.provider.name}`,
        isUser: true,
        timestamp: new Date(),
      });

      setIsTyping(true);
      setTimeout(() => {
        addMessage({
          id: `ai-${Date.now()}`,
          text: `Great choice! Opening ${option.provider.name} app to complete your booking for ₦${option.price.toLocaleString('en-NG')}. Your ride will arrive in approximately ${option.eta} minutes.`,
          isUser: false,
          timestamp: new Date(),
        });
        setIsTyping(false);
      }, 1000);
    },
    [addMessage]
  );

  const renderMessage = useCallback(
    ({ item }: { item: ExtendedMessage }) => {
      console.warn('[ChatScreen] Rendering message:', {
        id: item.id,
        hasTransportOptions: !!item.transportOptions,
        transportCount: item.transportOptions?.length,
      });

      return (
        <View>
          <ChatMessage message={item} showTimestamp />
          {item.transportOptions && (
            <View style={styles.transportOptionsContainer}>
              {item.transportOptions.map((option, index) => (
                <TransportCard
                  key={`${option.provider.name}-${index}`}
                  provider={option.provider}
                  price={option.price}
                  eta={option.eta}
                  badge={option.badge}
                  onBookPress={() => handleBookPress(option)}
                />
              ))}
            </View>
          )}
        </View>
      );
    },
    [styles.transportOptionsContainer, handleBookPress]
  );

  const keyExtractor = useCallback((item: ExtendedMessage) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
                <View style={styles.typingDots}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDotMiddle]} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            ) : null
          }
        />
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          placeholder="Ask me anything about Lagos transport..."
        />
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
    chatContainer: {
      flex: 1,
    },
    messageList: {
      paddingVertical: theme.spacing.md,
    },
    transportOptionsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      marginLeft: theme.spacing.md + 32 + theme.spacing.sm,
    },
    typingDots: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
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

export default ChatScreen;
