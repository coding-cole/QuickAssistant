import React, { useMemo, useState, useCallback } from 'react';
import { Alert, View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp, StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, TransportCard, TransportOption } from '@components/common';
import { HomeStackParamList } from '@app-types/navigation.types';
import { formatRelativeTime } from '@utils/formatters';
import { rideAppsService, RideAppProvider, RideAppParams } from '@services/rideApps';

export type PriceComparisonParams = {
  origin?: string;
  destination?: string;
  transportOptions?: TransportOption[];
  lastQuery?: string;
};

type PriceComparisonRouteProp = RouteProp<HomeStackParamList, 'PriceComparison'>;
type PriceComparisonNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'PriceComparison'
>;

const PriceComparisonScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<PriceComparisonRouteProp>();
  const navigation = useNavigation<PriceComparisonNavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    origin = 'Current Location',
    destination = 'Destination',
    transportOptions: passedOptions,
    lastQuery,
  } = route.params || {};

  const [transportOptions] = useState<TransportOption[]>(passedOptions ?? []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated] = useState<Date>(new Date());

  const handleRefresh = useCallback(() => {
    if (lastQuery) {
      navigation.dispatch(
        StackActions.popTo('Chat', {
          refreshQuery: lastQuery,
          refreshTimestamp: Date.now(),
        })
      );
    } else {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [lastQuery, navigation]);

  const handleBookPress = useCallback(
    (option: TransportOption) => {
      const supportedProviders: { keyword: string; provider: RideAppProvider }[] = [
        { keyword: 'uber', provider: 'uber' },
        { keyword: 'bolt', provider: 'bolt' },
      ];

      const name = option.provider.name.toLowerCase();
      const match = supportedProviders.find((p) => name.includes(p.keyword));
      const provider = match?.provider;
      if (provider) {
        const params: RideAppParams = {
          dropoff: destination
            ? { latitude: 0, longitude: 0, nickname: destination, formattedAddress: destination }
            : undefined,
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
      <>
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
        <View style={styles.caveat}>
          <Ionicons
            name="warning-outline"
            size={11}
            color={theme.colors.textSecondary}
            style={styles.caveatIcon}
          />
          <Typography variant="caption" color="secondary" style={styles.caveatText}>
            Fares may vary due to surge pricing, promotions, or account-based personalization.
          </Typography>
        </View>
      </>
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
          !lastQuery ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
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
    caveat: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing.xs,
      marginBottom: theme.spacing.md,
      gap: 4,
    },
    caveatIcon: {
      marginTop: 1,
    },
    caveatText: {
      flex: 1,
      fontSize: 10,
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
