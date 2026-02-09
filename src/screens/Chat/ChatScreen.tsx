import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, Theme } from '@theme';
import { ChatMessage, ChatInput, Message } from '@components/chat';
import { HomeStackParamList } from '@app-types/navigation.types';
import { groqService } from '@services/ai';

type ChatScreenRouteProp = RouteProp<HomeStackParamList, 'Chat'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Chat'>;

const getWelcomeMessage = (): Message => ({
  id: 'welcome',
  text: `Hello! I'm QuickAssistant, your AI-powered mobility companion for Lagos. Where would you like to go today?`,
  isUser: false,
  timestamp: new Date(),
});

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const { initialQuery } = route.params || {};

  // Set welcome message on mount
  useEffect(() => {
    setMessages([getWelcomeMessage()]);
  }, []);

  useEffect(() => {
    if (!isTyping) {
      dot1.setValue(0.3);
      dot2.setValue(0.3);
      dot3.setValue(0.3);
      return;
    }

    const createPulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    const animations = [createPulse(dot1, 0), createPulse(dot2, 150), createPulse(dot3, 300)];

    animations.forEach((animation) => animation.start());

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [isTyping, dot1, dot2, dot3]);

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

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: Message = {
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
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: response.message,
            isUser: false,
            timestamp: new Date(),
          };

          addMessage(aiMessage);

          // If AI provided transport options, navigate to PriceComparison
          if (response.metadata?.hasTransportOptions && response.metadata?.transportOptions) {
            navigation.navigate('PriceComparison', {
              origin: response.metadata.origin,
              destination: response.metadata.destination,
              transportOptions: response.metadata.transportOptions,
            });
          }
        } else {
          // Error response
          addMessage({
            id: `ai-error-${Date.now()}`,
            text:
              response.message ||
              response.error ||
              "I'm having trouble connecting. Please try again.",
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
    [addMessage, navigation]
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => <ChatMessage message={item} showTimestamp />,
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

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
                  <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
                  <Animated.View
                    style={[styles.typingDot, styles.typingDotMiddle, { opacity: dot2 }]}
                  />
                  <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
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
