import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { CalendarHeader, CalendarGrid, EventCard } from '@components/calendar';
import { MainTabParamList } from '@app-types/navigation.types';
import { CalendarEvent } from '@app-types/calendar.types';
import {
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';

const EVENT_TEMPLATES = [
  {
    title: 'Team sync',
    location: 'Ikoyi',
    description: 'Weekly alignment on project updates.',
  },
  {
    title: 'Client meeting',
    location: 'Victoria Island',
    description: 'Discuss requirements and next steps.',
  },
  {
    title: 'Gym session',
    location: 'Lekki Phase 1',
    description: 'Evening workout.',
  },
  {
    title: 'Lunch with partner',
    location: 'Maryland',
    description: 'Catch up over lunch.',
  },
  {
    title: 'Product review',
    location: 'Yaba',
    description: 'Review Q1 roadmap updates.',
  },
];

const getSeed = (date: Date) =>
  Number(
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}`
  );

const buildEventsForDate = (date: Date): CalendarEvent[] => {
  const seed = getSeed(date);
  const eventCount = seed % 4 === 0 ? 0 : (seed % 2) + 1;
  const startHours = [9, 13, 17];

  return Array.from({ length: eventCount }).map((_, index) => {
    const template = EVENT_TEMPLATES[(seed + index) % EVENT_TEMPLATES.length];
    const startHour = startHours[(seed + index) % startHours.length];
    const startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startHour,
      0,
      0
    );
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    return {
      id: `evt-${seed}-${index}`,
      title: `${template.title} - ${template.location}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      location: template.location,
      description: template.description,
    };
  });
};

const buildEventsForRange = (start: Date, end: Date): CalendarEvent[] => {
  const results: CalendarEvent[] = [];
  let cursor = startOfDay(start);
  const endDay = endOfDay(end);

  while (cursor <= endDay) {
    results.push(...buildEventsForDate(cursor));
    cursor = addDays(cursor, 1);
  }

  return results;
};

type CalendarNavigationProp = NavigationProp<MainTabParamList>;

type ViewMode = 'month' | 'week';

const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CalendarNavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const initialDate = new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get events for the current view range
  const visibleEvents = useMemo(() => {
    let start: Date;
    let end: Date;

    if (viewMode === 'month') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    } else {
      start = startOfWeek(currentDate, { weekStartsOn: 0 });
      end = endOfWeek(currentDate, { weekStartsOn: 0 });
    }

    return buildEventsForRange(start, end).filter((event) => {
      const eventDate = parseISO(event.startTime);
      return eventDate >= start && eventDate <= end;
    });
  }, [currentDate, viewMode]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return buildEventsForDate(selectedDate)
      .filter((event) => isSameDay(parseISO(event.startTime), selectedDate))
      .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
  }, [selectedDate]);

  const handlePrevious = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  }, [viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  }, [viewMode]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleEventPress = useCallback(
    (event: CalendarEvent) => {
      // Navigate to chat with event context
      navigation.navigate('Home', {
        screen: 'Chat',
        params: { initialQuery: `Tell me about my ${event.title} event` },
      });
    },
    [navigation]
  );

  const handleBookRidePress = useCallback(
    (event: CalendarEvent) => {
      // Navigate to price comparison for event location
      if (event.location) {
        navigation.navigate('Home', {
          screen: 'PriceComparison',
          params: { destination: event.location },
        });
      }
    },
    [navigation]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const renderEventItem = useCallback(
    ({ item }: { item: CalendarEvent }) => (
      <EventCard
        event={item}
        onPress={() => handleEventPress(item)}
        onBookRidePress={() => handleBookRidePress(item)}
      />
    ),
    [handleEventPress, handleBookRidePress]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="body" color="secondary" style={styles.emptyText}>
        No events scheduled for this day
      </Typography>
      <Typography variant="caption" color="secondary">
        Tap + to add a new event
      </Typography>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Typography variant="h4" style={styles.listHeaderTitle}>
        {isToday(selectedDate)
          ? 'Today'
          : isTomorrow(selectedDate)
            ? 'Tomorrow'
            : isYesterday(selectedDate)
              ? 'Yesterday'
              : format(selectedDate, 'EEEE, MMMM d')}
      </Typography>
      <Typography variant="caption" color="secondary">
        {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.banner}>
        <Typography variant="bodySmall" style={styles.bannerText}>
          Full calendar features are coming soon.
        </Typography>
      </View>
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewModeChange={handleViewModeChange}
      />

      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        events={visibleEvents}
        viewMode={viewMode}
        onDateSelect={handleDateSelect}
      />

      <View style={styles.eventsList}>
        <FlatList
          data={selectedDateEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    banner: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primaryLight + '30',
      borderWidth: 1,
      borderColor: theme.colors.primaryLight,
    },
    bannerText: {
      color: theme.colors.text,
    },
    eventsList: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    listHeaderTitle: {
      flex: 1,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      marginBottom: theme.spacing.xs,
    },
  });

export default CalendarScreen;
