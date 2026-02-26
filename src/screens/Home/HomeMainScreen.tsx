import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, Theme } from '@theme';
import { Typography, Card } from '@components/common';
import { HomeStackParamList } from '@app-types/navigation.types';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

interface FeatureCard {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'assistant',
    icon: 'hardware-chip-outline',
    title: 'AI Assistant',
    description: 'Your personal mobility companion for Lagos',
  },
  {
    id: 'calendar',
    icon: 'calendar-outline',
    title: 'Calendar Integration',
    description: 'Proactive travel suggestions based on your schedule',
  },
  {
    id: 'booking',
    icon: 'flash-outline',
    title: 'Quick Booking',
    description: 'Book rides instantly with Bolt, Uber, inDrive, BRT, and Metro',
  },
];

const QUICK_PROMPTS = [
  'Take me to Lekki',
  "What's the traffic like from VI?",
  'Check my calendar',
  'Book a ride to Ikeja',
];

const HomeMainScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeNavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [inputText, setInputText] = useState('');

  const notificationCount = 0;

  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      navigation.navigate('Chat', { initialQuery: inputText.trim() });
      setInputText('');
    }
  }, [inputText, navigation]);

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      navigation.navigate('Chat', { initialQuery: prompt });
    },
    [navigation]
  );

  const handleFeatureCardPress = useCallback(
    (featureId: string) => {
      switch (featureId) {
        case 'booking':
          navigation.navigate('Chat', { initialQuery: 'Where would you like to go?' });
          break;
        case 'calendar':
          navigation.navigate('Calendar', {});
          break;
        case 'assistant':
          navigation.navigate('Chat', {});
          break;
      }
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="sparkles" size={20} color={theme.colors.background} />
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Calendar', {})}
              accessibilityLabel="Calendar"
            >
              <Ionicons name="calendar-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityLabel={`Notifications, ${notificationCount} unread`}
            >
              <Ionicons name="notifications-outline" size={22} color={theme.colors.textSecondary} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Typography variant="caption" style={styles.notificationBadgeText}>
                    {notificationCount}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Typography variant="h2" style={styles.heroTitle}>
              Welcome to QuickAssistant
            </Typography>
            <Typography variant="bodySmall" color="secondary" style={styles.heroSubtitle}>
              Your AI-powered mobility companion for Lagos
            </Typography>
          </View>

          {/* Feature Cards Grid */}
          <View style={styles.featureGrid}>
            {FEATURE_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.featureCardWrapper}
                onPress={() => handleFeatureCardPress(card.id)}
                activeOpacity={0.8}
              >
                <Card style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={card.icon} size={32} color={theme.colors.primary} />
                  </View>
                  <Typography variant="body" style={styles.featureTitle}>
                    {card.title}
                  </Typography>
                  <Typography variant="caption" color="secondary" numberOfLines={2}>
                    {card.description}
                  </Typography>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Prompts */}
          <View style={styles.quickPromptsSection}>
            <Typography variant="caption" color="secondary" style={styles.quickPromptsLabel}>
              Try asking:
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickPromptsContainer}
            >
              {QUICK_PROMPTS.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickPromptPill}
                  onPress={() => handleQuickPrompt(prompt)}
                  activeOpacity={0.7}
                >
                  <Typography variant="bodySmall" style={styles.quickPromptText}>
                    {prompt}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom Chat Input */}
        <View style={styles.chatInputContainer}>
          <View style={styles.chatInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Where would you like to go?"
              placeholderTextColor={theme.colors.textDisabled}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              accessibilityLabel="Send message"
            >
              <Ionicons
                name="paper-plane"
                size={20}
                color={inputText.trim() ? theme.colors.primary : theme.colors.textDisabled}
              />
            </TouchableOpacity>
          </View>
        </View>
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
    keyboardView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerIcon: {
      padding: theme.spacing.xs,
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    notificationBadgeText: {
      color: theme.colors.background,
      fontSize: 10,
      fontWeight: theme.fontWeight.bold,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.lg,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    heroTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    heroSubtitle: {
      textAlign: 'center',
    },
    featureGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: theme.spacing.md,
      gap: 12,
    },
    featureCardWrapper: {
      width: '48%',
      flexGrow: 1,
    },
    featureCard: {
      padding: theme.spacing.md,
      minHeight: 140,
    },
    featureIconContainer: {
      marginBottom: theme.spacing.sm,
    },
    featureTitle: {
      fontWeight: theme.fontWeight.bold,
      marginBottom: 4,
    },
    quickPromptsSection: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    quickPromptsLabel: {
      marginBottom: theme.spacing.sm,
    },
    quickPromptsContainer: {
      gap: theme.spacing.sm,
    },
    quickPromptPill: {
      backgroundColor: theme.colors.primaryLight + '30',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      marginRight: theme.spacing.sm,
    },
    quickPromptText: {
      color: theme.colors.primary,
    },
    chatInputContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    chatInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 28,
      paddingHorizontal: theme.spacing.sm,
      height: 56,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputIcon: {
      padding: theme.spacing.sm,
    },
    textInput: {
      flex: 1,
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.sm,
    },
    sendButton: {
      padding: theme.spacing.sm,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

export default HomeMainScreen;
