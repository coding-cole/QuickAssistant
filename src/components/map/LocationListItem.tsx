import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { Location } from '@app-types/map.types';

interface LocationListItemProps {
  location: Location;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const getLocationIcon = (type: Location['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'recent':
      return 'time-outline';
    case 'saved':
      return 'bookmark-outline';
    case 'search':
    default:
      return 'location-outline';
  }
};

export const LocationListItem: React.FC<LocationListItemProps> = ({ location, onPress, style }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getLocationIcon(location.type)}
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      <View style={styles.content}>
        <Typography variant="body" numberOfLines={1}>
          {location.name}
        </Typography>
        <Typography variant="caption" color="secondary" numberOfLines={1}>
          {location.address}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
  });

export default LocationListItem;
