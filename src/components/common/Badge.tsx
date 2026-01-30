import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme, Theme } from '@theme';
import { palette } from '@theme/colors';

export type BadgeVariant =
  | 'recommended'
  | 'cheapest'
  | 'fastest'
  | 'completed'
  | 'scheduled'
  | 'cancelled';

export type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  variant: BadgeVariant;
  text: string;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const getBadgeColors = (variant: BadgeVariant) => {
  switch (variant) {
    case 'recommended':
      return { background: palette.badgeRecommended, text: palette.white };
    case 'cheapest':
      return { background: palette.badgeCheapest, text: palette.white };
    case 'fastest':
      return { background: palette.badgeFastest, text: palette.white };
    case 'completed':
      return { background: palette.badgeCompleted, text: palette.white };
    case 'scheduled':
      return { background: palette.badgeScheduled, text: palette.white };
    case 'cancelled':
      return { background: palette.badgeCancelled, text: palette.white };
    default:
      return { background: palette.gray400, text: palette.white };
  }
};

export const Badge: React.FC<BadgeProps> = ({ variant, text, size = 'medium', style, testID }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);
  const colors = getBadgeColors(variant);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={text}
    >
      <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
    </View>
  );
};

const createStyles = (theme: Theme, size: BadgeSize) =>
  StyleSheet.create({
    container: {
      paddingVertical: size === 'small' ? 2 : 4,
      paddingHorizontal: size === 'small' ? 8 : 12,
      borderRadius: size === 'small' ? 8 : 12,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: size === 'small' ? 10 : theme.fontSize.sm,
      fontWeight: theme.fontWeight.bold,
      textTransform: 'capitalize',
    },
  });
