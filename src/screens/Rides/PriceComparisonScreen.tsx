import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, TransportCard, TransportOption } from '@components/common';
import { HomeStackParamList } from '@app-types/navigation.types';
import { getTransportOptionsForRoute } from '@utils/mock/data';
import { formatRelativeTime } from '@utils/formatters';
import { rideAppsService, RideAppProvider, RideAppParams } from '@services/rideApps';

type PriceComparisonRouteProp = RouteProp<HomeStackParamList, 'PriceComparison'>;

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

const PriceComparisonScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<PriceComparisonRouteProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { origin = 'Current Location', destination = 'Lekki' } = route.params || {};

  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOptions = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const options = getTransportOptionsForRoute(origin, destination);
    setTransportOptions(options);
    setLastUpdated(new Date());
  }, [origin, destination]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchOptions();
      setIsLoading(false);
    };
    loadInitialData();
  }, [fetchOptions]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchOptions();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchOptions]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchOptions();
    setIsRefreshing(false);
  }, [fetchOptions]);

  const handleBookPress = useCallback(
    (option: TransportOption) => {
      const providerMap: Record<string, RideAppProvider> = {
        Uber: 'uber',
        Bolt: 'bolt',
      };

      const provider = providerMap[option.provider.name];
      if (provider) {
        const params: RideAppParams = {
          dropoff: destination ? { latitude: 0, longitude: 0, nickname: destination } : undefined,
        };
        rideAppsService.openApp(provider, params);
      } else {
        Alert.alert(
          'Not Supported',
          `Direct booking for ${option.provider.name} is not yet available.`
        );
      }
    },
    [destination]
  );

  const renderOption = useCallback(
    ({ item }: { item: TransportOption }) => (
      <TransportCard
        provider={item.provider}
        price={item.price}
        eta={item.eta}
        seats={item.seats}
        badge={item.badge}
        onBookPress={() => handleBookPress(item)}
      />
    ),
    [handleBookPress]
  );

  const keyExtractor = useCallback(
    (item: TransportOption, index: number) => `${item.provider.name}-${index}`,
    []
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.routeInfo}>
        <View style={styles.routeRow}>
          <Ionicons name="location" size={20} color={theme.colors.success} />
          <Typography variant="body" style={styles.routeText}>
            {origin}
          </Typography>
        </View>
        <View style={styles.routeDivider} />
        <View style={styles.routeRow}>
          <Ionicons name="flag" size={20} color={theme.colors.error} />
          <Typography variant="body" style={styles.routeText}>
            {destination}
          </Typography>
        </View>
      </View>
    ),
    [origin, destination, styles, theme]
  );

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        <View style={styles.updateInfo}>
          <Ionicons name="refresh-outline" size={16} color={theme.colors.textSecondary} />
          <Typography variant="caption" color="secondary" style={styles.updateText}>
            Updated {formatRelativeTime(lastUpdated.toISOString())}
          </Typography>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <Typography variant="bodySmall" style={styles.refreshButtonText}>
            Refresh
          </Typography>
        </TouchableOpacity>
      </View>
    ),
    [lastUpdated, handleRefresh, isRefreshing, styles, theme]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Typography variant="body" color="secondary" style={styles.loadingText}>
            Finding best options...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={transportOptions}
        renderItem={renderOption}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={theme.colors.textDisabled} />
            <Typography variant="body" color="secondary" style={styles.emptyText}>
              No transport options available
            </Typography>
          </View>
        }
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
    },
    listContent: {
      padding: theme.spacing.md,
    },
    routeInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    routeText: {
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    routeDivider: {
      width: 2,
      height: 24,
      backgroundColor: theme.colors.border,
      marginLeft: 9,
      marginVertical: theme.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    updateInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    updateText: {
      marginLeft: theme.spacing.xs,
    },
    refreshButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    refreshButtonText: {
      color: theme.colors.background,
      fontWeight: theme.fontWeight.semiBold,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
  });

export default PriceComparisonScreen;
