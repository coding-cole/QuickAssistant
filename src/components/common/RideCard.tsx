import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme, Theme } from '@theme';
import { Typography } from './Typography';
import { Badge, BadgeVariant } from './Badge';

export type RideStatus = 'completed' | 'scheduled' | 'cancelled';

export interface RideProvider {
  name: string;
  logo: ImageSourcePropType;
}

export interface Ride {
  id: string;
  provider: RideProvider;
  title: string;
  subtitle: string;
  timestamp: string;
  status: RideStatus;
}

interface RideCardProps {
  provider: RideProvider;
  title: string;
  subtitle: string;
  timestamp: string;
  status: RideStatus;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const formatFullTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const getStatusBadgeVariant = (status: RideStatus): BadgeVariant => {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'scheduled':
      return 'scheduled';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'completed';
  }
};

export const RideCard: React.FC<RideCardProps> = ({
  provider,
  title,
  subtitle,
  timestamp,
  status,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={provider.logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.infoContainer}>
          <Typography variant="body" style={styles.title}>
            {title}
          </Typography>
          <Typography variant="bodySmall" color="secondary">
            {subtitle}
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.timestamp}>
            {formatFullTimestamp(timestamp)}
          </Typography>
        </View>
        <View style={styles.rightSection}>
          <Badge variant={getStatusBadgeVariant(status)} text={status} style={styles.badge} />
        </View>
      </View>
    </CardWrapper>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    logoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    logo: {
      width: 28,
      height: 28,
    },
    infoContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    title: {
      fontWeight: theme.fontWeight.bold,
      marginBottom: 2,
    },
    timestamp: {
      marginTop: 4,
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    badge: {
      marginTop: theme.spacing.xs,
    },
  });
