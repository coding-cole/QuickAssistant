import React, { useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';

interface LocationSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  onClear,
  placeholder = 'Where to?',
  autoFocus = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textDisabled}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
  });

export default LocationSearchBar;
