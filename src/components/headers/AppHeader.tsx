import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';

interface AppHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
    label: string;
  };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  description,
  showBackButton = true,
  rightAction,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.actionSpace}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleCenter}>
          <Typography variant="h2" align="center">
            {title}
          </Typography>
        </View>
        <View style={styles.actionSpace}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel={rightAction.label}
            >
              <Ionicons name={rightAction.icon as any} size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {description && (
        <Typography variant="body" color="secondary" align="center" style={styles.description}>
          {description}
        </Typography>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionSpace: {
      width: 40,
      alignItems: 'center',
    },
    button: {
      padding: theme.spacing.sm,
    },
    titleCenter: {
      flex: 1,
      alignItems: 'center',
    },
    description: {
      marginTop: theme.spacing.xs,
    },
  });
