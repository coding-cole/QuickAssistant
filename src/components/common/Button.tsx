import React, { useMemo, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  AccessibilityProps,
} from 'react-native';
import { useTheme, Theme } from '@theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isDisabled = disabled || loading;

  const containerStyle = useMemo(
    () => [
      styles.base,
      styles[`${variant}Container`],
      styles[`${size}Container`],
      fullWidth && styles.fullWidth,
      isDisabled && styles.disabled,
      style,
    ],
    [styles, variant, size, fullWidth, isDisabled, style]
  );

  const labelStyle = useMemo(
    () => [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
      isDisabled && styles.disabledText,
      textStyle,
    ],
    [styles, variant, size, isDisabled, textStyle]
  );

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      onPress();
    }
  }, [isDisabled, onPress]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...accessibilityProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#fff' : theme.colors.primary}
        />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.5,
    },
    // Variants - Container
    primaryContainer: {
      backgroundColor: theme.colors.primary,
    },
    secondaryContainer: {
      backgroundColor: theme.colors.secondary,
    },
    outlineContainer: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    ghostContainer: {
      backgroundColor: 'transparent',
    },
    // Sizes - Container
    smContainer: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      minHeight: 32,
    },
    mdContainer: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 44,
    },
    lgContainer: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 52,
    },
    // Text base
    text: {
      ...theme.typography.button,
    },
    // Variants - Text
    primaryText: {
      color: '#ffffff',
    },
    secondaryText: {
      color: '#ffffff',
    },
    outlineText: {
      color: theme.colors.primary,
    },
    ghostText: {
      color: theme.colors.primary,
    },
    // Sizes - Text
    smText: {
      fontSize: theme.fontSize.sm,
    },
    mdText: {
      fontSize: theme.fontSize.lg,
    },
    lgText: {
      fontSize: theme.fontSize.xl,
    },
    disabledText: {
      color: theme.colors.textDisabled,
    },
  });
