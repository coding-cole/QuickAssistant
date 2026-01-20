import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { useAppSelector } from '@state';
import { selectUserFullName } from '@state/selectors/authSelectors';
import { Typography, Card } from '@components/common';

const HomeScreen: React.FC = () => {
  const { theme, toggleTheme, themeMode } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userName = useAppSelector(selectUserFullName);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Typography variant="h2">Hello{userName ? `, ${userName}` : ''}!</Typography>
            <Typography variant="body" color="secondary">
              Welcome to QuickAssistant
            </Typography>
          </View>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            accessibilityLabel={`Current theme: ${themeMode}. Tap to change.`}
          >
            <Ionicons name={getThemeModeIcon()} size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette-outline" size={24} color={theme.colors.primary} />
            <Typography variant="h4" style={styles.cardTitle}>
              Theme Settings
            </Typography>
          </View>
          <Typography variant="body" color="secondary">
            Current mode: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.cardHint}>
            Tap the icon above to cycle through: Light - Dark - System
          </Typography>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash-outline" size={24} color={theme.colors.primary} />
            <Typography variant="h4" style={styles.cardTitle}>
              Quick Actions
            </Typography>
          </View>
          <Typography variant="body" color="secondary">
            Your quick actions will appear here. This is a placeholder for future functionality.
          </Typography>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
            <Typography variant="h4" style={styles.cardTitle}>
              Getting Started
            </Typography>
          </View>
          <Typography variant="body" color="secondary" style={styles.cardDescription}>
            This is your QuickAssistant app, built with:
          </Typography>
          <View style={styles.featureList}>
            {[
              'React Native + Expo',
              'TypeScript',
              'Redux Toolkit + RTK Query',
              'React Navigation',
              'React Hook Form + Yup',
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Typography variant="bodySmall" style={styles.featureText}>
                  {feature}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xl,
    },
    themeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    cardTitle: {
      marginLeft: theme.spacing.sm,
    },
    cardHint: {
      marginTop: theme.spacing.xs,
    },
    cardDescription: {
      marginBottom: theme.spacing.sm,
    },
    featureList: {
      gap: theme.spacing.xs,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    featureText: {
      color: theme.colors.text,
    },
  });

export default HomeScreen;
