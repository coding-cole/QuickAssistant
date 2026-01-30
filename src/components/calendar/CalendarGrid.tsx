import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { CalendarEvent } from '@app-types/calendar.types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { palette } from '@theme/colors';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 32) / 7);

type ViewMode = 'month' | 'week';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  viewMode: ViewMode;
  onDateSelect: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
}

const getEventTypeColor = (type: CalendarEvent['type']): string => {
  const colors = {
    meeting: '#2196F3',
    ride: palette.primary500,
    reminder: palette.warning,
    personal: '#9C27B0',
    work: palette.success,
  };
  return colors[type] || palette.primary500;
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  viewMode,
  onDateSelect,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Get days to display based on view mode
  const daysToDisplay = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  }, [currentDate, viewMode]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach((event) => {
      const dateKey = format(parseISO(event.startTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  const renderDayCell = (day: Date, index: number) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isSelected = isSameDay(day, selectedDate);
    const isTodayDate = isToday(day);
    const dayEvents = getEventsForDate(day);
    const hasEvents = dayEvents.length > 0;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          viewMode === 'week' && styles.weekDayCell,
          !isCurrentMonth && viewMode === 'month' && styles.otherMonthDay,
        ]}
        onPress={() => onDateSelect(day)}
        activeOpacity={0.7}
        accessibilityLabel={`${format(day, 'MMMM d, yyyy')}${hasEvents ? `, ${dayEvents.length} events` : ''}`}
      >
        <View
          style={[
            styles.dayNumberContainer,
            isSelected && styles.selectedDay,
            isTodayDate && !isSelected && styles.todayDay,
          ]}
        >
          <Typography
            variant="bodySmall"
            style={[
              styles.dayNumber,
              !isCurrentMonth && viewMode === 'month' && styles.otherMonthText,
              isSelected && styles.selectedDayText,
              isTodayDate && !isSelected && styles.todayDayText,
            ]}
          >
            {format(day, 'd')}
          </Typography>
        </View>

        {/* Event indicators */}
        {hasEvents && (
          <View style={styles.eventIndicators}>
            {dayEvents.slice(0, 3).map((event, eventIndex) => (
              <View
                key={eventIndex}
                style={[
                  styles.eventDot,
                  { backgroundColor: getEventTypeColor(event.type) },
                  event.status === 'cancelled' && styles.cancelledDot,
                ]}
              />
            ))}
            {dayEvents.length > 3 && (
              <Typography variant="caption" style={styles.moreEventsText}>
                +{dayEvents.length - 3}
              </Typography>
            )}
          </View>
        )}

        {/* Show event preview in week view */}
        {viewMode === 'week' && hasEvents && (
          <View style={styles.weekEventPreview}>
            {dayEvents.slice(0, 2).map((event, eventIndex) => (
              <View
                key={eventIndex}
                style={[styles.weekEventItem, { borderLeftColor: getEventTypeColor(event.type) }]}
              >
                <Typography variant="caption" numberOfLines={1} style={styles.weekEventText}>
                  {event.title}
                </Typography>
              </View>
            ))}
            {dayEvents.length > 2 && (
              <Typography variant="caption" color="secondary" style={styles.weekMoreText}>
                +{dayEvents.length - 2} more
              </Typography>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Typography variant="caption" color="secondary" style={styles.weekdayText}>
              {day}
            </Typography>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={[styles.grid, viewMode === 'week' && styles.weekGrid]}>
        {daysToDisplay.map((day, index) => renderDayCell(day, index))}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
    },
    weekdayRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
    },
    weekdayCell: {
      width: CELL_SIZE,
      alignItems: 'center',
    },
    weekdayText: {
      fontWeight: theme.fontWeight.semiBold,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    weekGrid: {
      minHeight: 120,
    },
    dayCell: {
      width: CELL_SIZE,
      minHeight: CELL_SIZE,
      paddingVertical: 4,
      alignItems: 'center',
    },
    weekDayCell: {
      minHeight: 120,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      paddingHorizontal: 2,
    },
    otherMonthDay: {
      opacity: 0.4,
    },
    dayNumberContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedDay: {
      backgroundColor: theme.colors.primary,
    },
    todayDay: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    dayNumber: {
      textAlign: 'center',
    },
    otherMonthText: {
      color: theme.colors.textDisabled,
    },
    selectedDayText: {
      color: theme.colors.background,
      fontWeight: theme.fontWeight.bold,
    },
    todayDayText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.bold,
    },
    eventIndicators: {
      flexDirection: 'row',
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: CELL_SIZE - 8,
    },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginHorizontal: 1,
    },
    cancelledDot: {
      opacity: 0.4,
    },
    moreEventsText: {
      fontSize: 8,
      color: theme.colors.textSecondary,
      marginLeft: 2,
    },
    weekEventPreview: {
      marginTop: 4,
      width: '100%',
      paddingHorizontal: 2,
    },
    weekEventItem: {
      backgroundColor: theme.colors.background,
      borderLeftWidth: 3,
      borderRadius: 2,
      paddingHorizontal: 4,
      paddingVertical: 2,
      marginBottom: 2,
    },
    weekEventText: {
      fontSize: 10,
    },
    weekMoreText: {
      fontSize: 10,
      textAlign: 'center',
    },
  });

export default CalendarGrid;
