import React, { useState, useMemo, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      secureTextEntry,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    const handleToggleSecure = () => setIsSecure(!isSecure);

    const inputContainerStyle = useMemo(
      () => [
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ],
      [styles, isFocused, error]
    );

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label} accessibilityRole="text">
            {label}
          </Text>
        )}
        <View style={inputContainerStyle}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={theme.colors.textSecondary}
              style={styles.leftIcon}
            />
          )}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={theme.colors.textDisabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={isSecure}
            accessibilityLabel={label}
            {...props}
          />
          {secureTextEntry && (
            <TouchableOpacity
              onPress={handleToggleSecure}
              accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
              accessibilityRole="button"
            >
              <Ionicons
                name={isSecure ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.colors.textSecondary}
                style={styles.rightIcon}
              />
            </TouchableOpacity>
          )}
          {rightIcon && !secureTextEntry && (
            <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
              <Ionicons
                name={rightIcon}
                size={20}
                color={theme.colors.textSecondary}
                style={styles.rightIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        )}
        {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      minHeight: 48,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    leftIcon: {
      marginRight: theme.spacing.sm,
    },
    rightIcon: {
      marginLeft: theme.spacing.sm,
    },
    error: {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    hint: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });
