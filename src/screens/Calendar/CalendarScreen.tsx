import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { CalendarHeader, CalendarGrid, EventCard } from '@components/calendar';
import { HomeStackParamList } from '@app-types/navigation.types';
import { CalendarEvent } from '@app-types/calendar.types';
import {
  mockCalendarEvents,
  getEventsForDate,
  getRelativeDayLabel,
} from '@utils/mock/data/calendarData';
import {
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
} from 'date-fns';

export type CalendarParams = {
  selectedDate?: string;
};

type CalendarNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Calendar'>;
type CalendarRouteProp = RouteProp<HomeStackParamList, 'Calendar'>;

type ViewMode = 'month' | 'week';

const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CalendarNavigationProp>();
  const route = useRoute<CalendarRouteProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Parse initial date from route params if provided
  const initialDate = route.params?.selectedDate ? parseISO(route.params.selectedDate) : new Date();

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

    return mockCalendarEvents.filter((event) => {
      const eventDate = parseISO(event.startTime);
      return eventDate >= start && eventDate <= end;
    });
  }, [currentDate, viewMode]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate).sort(
      (a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
    );
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
      navigation.navigate('Chat', {
        initialQuery: `Tell me about my ${event.title} event`,
      });
    },
    [navigation]
  );

  const handleBookRidePress = useCallback(
    (event: CalendarEvent) => {
      // Navigate to price comparison for event location
      if (event.location) {
        navigation.navigate('PriceComparison', {
          destination: event.location,
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
        {getRelativeDayLabel(format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"))}
      </Typography>
      <Typography variant="caption" color="secondary">
        {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
