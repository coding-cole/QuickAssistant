import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';

interface AuthHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
  showBackButton = true,
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
        <View style={styles.backButtonSpace}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleCenter}>
          <Typography variant="h1" align="center">
            {title}
          </Typography>
        </View>
        <View style={styles.backButtonSpace} />
      </View>
      <Typography variant="body" color="secondary" align="center" style={styles.description}>
        {description}
      </Typography>
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
    backButtonSpace: {
      width: 40,
    },
    backButton: {
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
