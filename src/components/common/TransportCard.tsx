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
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from './Typography';
import { Badge, BadgeVariant } from './Badge';

export interface TransportProvider {
  name: string;
  logo: ImageSourcePropType;
  color: string;
}

export interface TransportOption {
  provider: TransportProvider;
  price: number;
  eta: number;
  seats: number;
  badge?: BadgeVariant | null;
}

interface TransportCardProps {
  provider: TransportProvider;
  price: number;
  eta: number;
  seats: number;
  badge?: BadgeVariant | null;
  onBookPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const formatPrice = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

const formatETA = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
};

export const TransportCard: React.FC<TransportCardProps> = ({
  provider,
  price,
  eta,
  seats,
  badge,
  onBookPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, style]} testID={testID} accessibilityRole="button">
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.logoContainer, { borderColor: provider.color }]}>
            <Image source={provider.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.infoContainer}>
            <Typography variant="h4" style={styles.providerName}>
              {provider.name}
            </Typography>
            <View style={styles.etaContainer}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              <Typography variant="bodySmall" color="secondary" style={styles.etaText}>
                ETA: {formatETA(eta)}
              </Typography>
            </View>
            {typeof seats === 'number' && (
              <View style={styles.seatsContainer}>
                <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
                <Typography variant="bodySmall" color="secondary" style={styles.seatsText}>
                  Seats: {seats}
                </Typography>
              </View>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Typography variant="h3" style={styles.price}>
            {formatPrice(price)}
          </Typography>
          {badge && <Badge variant={badge} text={badge} style={styles.badge} />}
        </View>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={onBookPress}
        activeOpacity={0.8}
        accessibilityLabel={`Book ${provider.name} for ${formatPrice(price)}`}
        accessibilityRole="button"
      >
        <Typography variant="button" style={styles.bookButtonText}>
          Book Now
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: theme.spacing.md,
      marginBottom: 12,
      ...theme.shadows.md,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      overflow: 'hidden',
    },
    logo: {
      width: 32,
      height: 32,
    },
    infoContainer: {
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    providerName: {
      marginBottom: 2,
    },
    etaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    etaText: {
      marginLeft: 4,
    },
    seatsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    seatsText: {
      marginLeft: 4,
    },
    rightSection: {
      alignItems: 'flex-end',
    },
    price: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.bold,
    },
    badge: {
      marginTop: theme.spacing.xs,
    },
    bookButton: {
      backgroundColor: theme.colors.primary,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookButtonText: {
      color: theme.colors.background,
    },
  });
