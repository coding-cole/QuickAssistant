import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { SavedPlace } from '@app-types/map.types';

interface SavedPlaceCardProps {
  place: SavedPlace;
  onPress: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const getPlaceIcon = (icon: SavedPlace['icon']): keyof typeof Ionicons.glyphMap => {
  switch (icon) {
    case 'home':
      return 'home';
    case 'briefcase':
      return 'briefcase';
    case 'star':
      return 'star';
    case 'location':
    default:
      return 'location';
  }
};

export const SavedPlaceCard: React.FC<SavedPlaceCardProps> = ({
  place,
  onPress,
  compact = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, compact), [theme, compact]);

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactContainer, style]} onPress={onPress}>
        <View style={styles.compactIconContainer}>
          <Ionicons name={getPlaceIcon(place.icon)} size={20} color={theme.colors.primary} />
        </View>
        <Typography variant="bodySmall" numberOfLines={1}>
          {place.label || place.name}
        </Typography>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name={getPlaceIcon(place.icon)} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.content}>
        <Typography variant="body" style={styles.name}>
          {place.label || place.name}
        </Typography>
        <Typography variant="caption" color="secondary" numberOfLines={1}>
          {place.address}
        </Typography>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme, compact: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    compactContainer: {
      alignItems: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 80,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    compactIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    name: {
      fontWeight: theme.fontWeight.semiBold,
      marginBottom: 2,
    },
  });

export default SavedPlaceCard;
