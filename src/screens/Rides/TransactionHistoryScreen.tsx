import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, TransactionCard, Transaction, TransactionStatus } from '@components/common';

type FilterOption = 'all' | TransactionStatus;

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

const TransactionHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filteredTransactions = useMemo(() => {
    if (filterStatus === 'all') {
      return transactions;
    }
    return transactions.filter((t) => t.status === filterStatus);
  }, [transactions, filterStatus]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    // In a real app, navigate to transaction details
    console.warn('Transaction pressed:', transaction.id);
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

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionCard
        provider={item.provider}
        title={item.title}
        subtitle={item.subtitle}
        amount={item.amount}
        timestamp={item.timestamp}
        status={item.status}
        onPress={() => handleTransactionPress(item)}
      />
    ),
    [handleTransactionPress]
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color={theme.colors.textDisabled} />
        <Typography variant="h4" style={styles.emptyTitle}>
          No transactions yet
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
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
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

export default TransactionHistoryScreen;
