import React, { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { ChatMessage, ChatInput, Message } from '@components/chat';
import { HomeStackParamList } from '@app-types/navigation.types';
import { tripEstimationService } from '@services/ai';
import { useAppDispatch, useAppSelector } from '@state/store';
import { addMessage as addChatMessage, clearMessages, SerializableMessage } from '@state/slices';
import { selectChatMessages } from '@state/selectors';
import { TransportOption } from '@components/common';

export type ChatParams = {
  initialQuery?: string;
  refreshQuery?: string;
  refreshTimestamp?: number;
};

type ChatScreenRouteProp = RouteProp<HomeStackParamList, 'Chat'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Chat'>;

const WELCOME_MESSAGE: SerializableMessage = {
  id: 'welcome',
  text: `Hello! I'm QuickAssistant, your AI-powered mobility companion for Lagos. Where would you like to go today?`,
  isUser: false,
  timestamp: new Date().toISOString(),
};

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight + insets.top : 0;

  const storedMessages = useAppSelector(selectChatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const isRefreshRef = useRef(false);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const { initialQuery, refreshQuery, refreshTimestamp } = route.params || {};

  // Convert stored messages to renderable Message objects (reconstruct onActionPress from actionParams)
  const messages: Message[] = useMemo(
    () =>
      storedMessages.map((msg) => {
        const message: Message = {
          id: msg.id,
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp),
          type: msg.type,
          actionLabel: msg.actionLabel,
        };

        if (msg.actionLabel && msg.actionParams) {
          const params = msg.actionParams;
          message.onActionPress = () => {
            navigation.navigate('PriceComparison', {
              origin: params.origin,
              destination: params.destination,
              transportOptions: params.transportOptions as TransportOption[],
              lastQuery: params.lastQuery,
            });
          };
        }

        return message;
      }),
    [storedMessages, navigation]
  );

  // Add welcome message on mount if no messages exist
  useEffect(() => {
    if (storedMessages.length === 0) {
      dispatch(addChatMessage(WELCOME_MESSAGE));
    }
  }, []);

  // Header menu with clear chat option
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Clear Chat', 'Are you sure you want to clear all messages?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear',
                style: 'destructive',
                onPress: () => {
                  dispatch(clearMessages());
                  dispatch(addChatMessage(WELCOME_MESSAGE));
                },
              },
            ]);
          }}
          style={{ marginRight: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch, theme]);

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
      const timer = setTimeout(() => {
        handleSend(initialQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  // Handle refresh from PriceComparison — re-ask the last query and auto-navigate back
  useEffect(() => {
    if (refreshQuery && refreshTimestamp) {
      isRefreshRef.current = true;
      handleSend(refreshQuery);
    }
  }, [refreshTimestamp]);

  const handleSend = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: SerializableMessage = {
        id: `user-${Date.now()}`,
        text,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      dispatch(addChatMessage(userMessage));
      setIsTyping(true);

      try {
        // Get AI response
        const response = await tripEstimationService.sendMessage(text);

        if (response.success) {
          const meta = response.metadata;

          if (meta?.hasTransportOptions && meta?.transportOptions && meta?.summary) {
            const actionParams = {
              origin: meta.origin,
              destination: meta.destination,
              transportOptions: meta.transportOptions as unknown[],
              lastQuery: text,
            };

            // Add summary message to chat history
            const aiMessage: SerializableMessage = {
              id: `ai-${Date.now()}`,
              text: meta.summary,
              isUser: false,
              timestamp: new Date().toISOString(),
              actionLabel: 'See Options',
              actionParams,
            };
            dispatch(addChatMessage(aiMessage));

            // Auto-navigate if triggered by refresh (no manual tap needed)
            if (isRefreshRef.current) {
              isRefreshRef.current = false;
              navigation.navigate('PriceComparison', {
                origin: meta.origin,
                destination: meta.destination,
                transportOptions: meta.transportOptions,
                lastQuery: text,
              });
            }
          } else {
            // Regular AI response (no transport options)
            const aiMessage: SerializableMessage = {
              id: `ai-${Date.now()}`,
              text: response.message,
              isUser: false,
              timestamp: new Date().toISOString(),
            };
            dispatch(addChatMessage(aiMessage));
          }
        } else {
          // Error response
          dispatch(
            addChatMessage({
              id: `ai-error-${Date.now()}`,
              text:
                response.message ||
                response.error ||
                "I'm having trouble connecting. Please try again.",
              isUser: false,
              timestamp: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error('Chat error:', error);
        dispatch(
          addChatMessage({
            id: `ai-error-${Date.now()}`,
            text: 'Sorry, I encountered an error. Please try again.',
            isUser: false,
            timestamp: new Date().toISOString(),
          })
        );
      } finally {
        setIsTyping(false);
      }
    },
    [dispatch, navigation]
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
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
