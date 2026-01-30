import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, Badge } from '@components/common';
import { CalendarEvent } from '@app-types/calendar.types';
import { palette } from '@theme/colors';
import { format, parseISO } from 'date-fns';

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
  onBookRidePress?: () => void;
  showDate?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const getEventTypeConfig = (type: CalendarEvent['type']) => {
  const configs = {
    meeting: {
      icon: 'people-outline' as const,
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
    },
    ride: {
      icon: 'car-outline' as const,
      color: palette.primary500,
      backgroundColor: palette.primary100,
    },
    reminder: {
      icon: 'alarm-outline' as const,
      color: palette.warning,
      backgroundColor: '#FFF3E0',
    },
    personal: {
      icon: 'person-outline' as const,
      color: '#9C27B0',
      backgroundColor: '#F3E5F5',
    },
    work: {
      icon: 'briefcase-outline' as const,
      color: palette.success,
      backgroundColor: '#E8F5E9',
    },
  };

  return configs[type] || configs.personal;
};

const getStatusConfig = (status: CalendarEvent['status']) => {
  switch (status) {
    case 'upcoming':
      return { variant: 'scheduled' as const, text: 'Upcoming' };
    case 'ongoing':
      return { variant: 'recommended' as const, text: 'Now' };
    case 'completed':
      return { variant: 'completed' as const, text: 'Completed' };
    case 'cancelled':
      return { variant: 'cancelled' as const, text: 'Cancelled' };
    default:
      return { variant: 'scheduled' as const, text: 'Upcoming' };
  }
};

const formatEventTime = (startTime: string, endTime: string): string => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onBookRidePress,
  showDate = false,
  compact = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, compact), [theme, compact]);
  const typeConfig = getEventTypeConfig(event.type);
  const statusConfig = getStatusConfig(event.status);

  const eventDate = parseISO(event.startTime);
  const showBookRideButton =
    !event.hasRideBooked &&
    event.status === 'upcoming' &&
    event.location &&
    event.location !== 'Remote';

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.card, event.status === 'cancelled' && styles.cancelledCard, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${event.title} at ${formatEventTime(event.startTime, event.endTime)}`}
    >
      {/* Left color indicator */}
      <View style={[styles.colorIndicator, { backgroundColor: typeConfig.color }]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}>
            <Ionicons name={typeConfig.icon} size={compact ? 16 : 20} color={typeConfig.color} />
          </View>
          <View style={styles.titleContainer}>
            <Typography
              variant={compact ? 'bodySmall' : 'body'}
              style={[styles.title, event.status === 'cancelled' && styles.cancelledText]}
              numberOfLines={1}
            >
              {event.title}
            </Typography>
            {showDate && (
              <Typography variant="caption" color="secondary">
                {format(eventDate, 'EEE, MMM d')}
              </Typography>
            )}
          </View>
          {!compact && (
            <Badge variant={statusConfig.variant} text={statusConfig.text} size="small" />
          )}
        </View>

        {/* Time row */}
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Typography variant="caption" color="secondary" style={styles.timeText}>
            {formatEventTime(event.startTime, event.endTime)}
          </Typography>
        </View>

        {/* Location row */}
        {event.location && !compact && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
            <Typography
              variant="caption"
              color="secondary"
              style={styles.locationText}
              numberOfLines={1}
            >
              {event.location}
            </Typography>
          </View>
        )}

        {/* Description (only if not compact and has description) */}
        {event.description && !compact && (
          <Typography
            variant="caption"
            color="secondary"
            numberOfLines={2}
            style={styles.description}
          >
            {event.description}
          </Typography>
        )}

        {/* Ride info or Book ride button */}
        {!compact && (
          <View style={styles.rideSection}>
            {event.hasRideBooked && event.rideDetails ? (
              <View style={styles.rideBookedInfo}>
                <View style={styles.rideBookedBadge}>
                  <Ionicons name="car" size={14} color={palette.success} />
                  <Typography variant="caption" style={styles.rideBookedText}>
                    {event.rideDetails.provider} booked
                  </Typography>
                </View>
                <Typography variant="caption" color="secondary">
                  Pickup: {format(parseISO(event.rideDetails.pickupTime), 'h:mm a')}
                </Typography>
              </View>
            ) : showBookRideButton ? (
              <TouchableOpacity
                style={styles.bookRideButton}
                onPress={onBookRidePress}
                activeOpacity={0.7}
              >
                <Ionicons name="car-outline" size={16} color={theme.colors.primary} />
                <Typography variant="caption" style={styles.bookRideText}>
                  Book a ride
                </Typography>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </View>
    </CardWrapper>
  );
};

const createStyles = (theme: Theme, compact: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginVertical: compact ? 2 : 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    cancelledCard: {
      opacity: 0.6,
    },
    colorIndicator: {
      width: 4,
    },
    content: {
      flex: 1,
      padding: compact ? 8 : 12,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: compact ? 28 : 36,
      height: compact ? 28 : 36,
      borderRadius: compact ? 14 : 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    title: {
      fontWeight: theme.fontWeight.semiBold,
    },
    cancelledText: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: compact ? 4 : 8,
    },
    timeText: {
      marginLeft: 4,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    locationText: {
      marginLeft: 4,
      flex: 1,
    },
    description: {
      marginTop: 8,
    },
    rideSection: {
      marginTop: 8,
    },
    rideBookedInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#E8F5E9',
      borderRadius: 8,
      padding: 8,
    },
    rideBookedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rideBookedText: {
      color: palette.success,
      fontWeight: theme.fontWeight.semiBold,
      marginLeft: 4,
    },
    bookRideButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.primary100,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignSelf: 'flex-start',
    },
    bookRideText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semiBold,
      marginLeft: 4,
    },
  });

export default EventCard;
