import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, RideCard, Ride, RideStatus } from '@components/common';
import { getProviderColor, getProviderLogo } from '@utils/parseTransportOptions';

type FilterOption = 'all' | RideStatus;

interface FilterTab {
  key: FilterOption;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'cancelled', label: 'Cancelled' },
];

const DUMMY_RIDES: Ride[] = [
  {
    id: 'ride-1',
    provider: {
      name: 'Uber',
      logo: getProviderLogo('Uber', getProviderColor('uber')),
    },
    title: 'Lekki Phase 1 → Victoria Island',
    subtitle: 'UberX • ₦4,200',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'ride-2',
    provider: {
      name: 'Bolt',
      logo: getProviderLogo('Bolt', getProviderColor('bolt')),
    },
    title: 'Yaba → Ikoyi',
    subtitle: 'Bolt Basic • ₦3,500',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'ride-3',
    provider: {
      name: 'inDrive',
      logo: getProviderLogo('inDrive', getProviderColor('indrive')),
    },
    title: 'Maryland → Ikeja',
    subtitle: 'Standard • ₦2,800',
    timestamp: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
  },
  {
    id: 'ride-4',
    provider: {
      name: 'Uber',
      logo: getProviderLogo('Uber', getProviderColor('uber')),
    },
    title: 'Ajah → Lekki',
    subtitle: 'UberX • ₦3,900',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'cancelled',
  },
];

const RideHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rides, setRides] = useState<Ride[]>(DUMMY_RIDES);

  const filteredRides = useMemo(() => {
    if (filterStatus === 'all') {
      return rides;
    }
    return rides.filter((r) => r.status === filterStatus);
  }, [rides, filterStatus]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleRidePress = useCallback((ride: Ride) => {
    // In a real app, navigate to ride details
    console.warn('Ride pressed:', ride.id);
  }, []);

  const renderFilterTabs = useCallback(
    () => (
      <View style={styles.filterContainer}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filterStatus === tab.key && styles.filterTabActive]}
            onPress={() => setFilterStatus(tab.key)}
            accessibilityLabel={`Filter by ${tab.label}`}
            accessibilityState={{ selected: filterStatus === tab.key }}
          >
            <Typography
              variant="bodySmall"
              style={[styles.filterTabText, filterStatus === tab.key && styles.filterTabTextActive]}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [filterStatus, styles]
  );

  const renderRide = useCallback(
    ({ item }: { item: Ride }) => (
      <RideCard
        provider={item.provider}
        title={item.title}
        subtitle={item.subtitle}
        timestamp={item.timestamp}
        status={item.status}
        onPress={() => handleRidePress(item)}
      />
    ),
    [handleRidePress]
  );

  const keyExtractor = useCallback((item: Ride) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="car-outline" size={64} color={theme.colors.textDisabled} />
        <Typography variant="h4" style={styles.emptyTitle}>
          No rides yet
        </Typography>
        <Typography variant="body" color="secondary" style={styles.emptySubtitle}>
          You haven't booked any rides yet.{'\n'}Start by searching for a destination!
        </Typography>
        <TouchableOpacity style={styles.emptyButton}>
          <Typography variant="button" style={styles.emptyButtonText}>
            Find a Ride
          </Typography>
        </TouchableOpacity>
      </View>
    ),
    [styles, theme]
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderFilterTabs()}
      <View style={styles.banner}>
        <Typography variant="bodySmall" style={styles.bannerText}>
          Full ride history features are coming soon.
        </Typography>
      </View>

      <FlatList
        data={filteredRides}
        renderItem={renderRide}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
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
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterTab: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    filterTabActive: {
      backgroundColor: theme.colors.primary,
    },
    filterTabText: {
      color: theme.colors.textSecondary,
    },
    filterTabTextActive: {
      color: theme.colors.background,
      fontWeight: theme.fontWeight.semiBold,
    },
    listContent: {
      padding: theme.spacing.md,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    emptyTitle: {
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    emptySubtitle: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyButton: {
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    emptyButtonText: {
      color: theme.colors.background,
    },
  });

export default RideHistoryScreen;
