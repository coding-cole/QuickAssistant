import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, Card } from '@components/common';

const QUICK_DESTINATIONS = [
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi',
  'Yaba',
  'Ikeja',
  'Maryland',
];

const MapScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.placeholderCard}>
          <View style={styles.placeholderIcon}>
            <Ionicons name="map" size={36} color={theme.colors.primary} />
          </View>
          <Typography variant="body" style={styles.placeholderTitle}>
            Map view coming soon
          </Typography>
          <Typography variant="caption" color="secondary">
            Search and route previews will appear here.
          </Typography>
        </Card>

        <View style={styles.sectionHeader}>
          <Typography variant="bodySmall" color="secondary">
            Quick destinations
          </Typography>
        </View>
        {QUICK_DESTINATIONS.map((place) => (
          <Card key={place} style={styles.destinationCard}>
            <View style={styles.destinationRow}>
              <Ionicons name="location" size={18} color={theme.colors.primary} />
              <Typography variant="body" style={styles.destinationText}>
                {place}
              </Typography>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.md,
    },
    placeholderCard: {
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    placeholderIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryLight + '30',
      marginBottom: theme.spacing.xs,
    },
    placeholderTitle: {
      fontWeight: theme.fontWeight.semiBold,
    },
    sectionHeader: {
      marginTop: theme.spacing.sm,
    },
    destinationCard: {
      padding: theme.spacing.md,
    },
    destinationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    destinationText: {
      flex: 1,
    },
  });

export default MapScreen;
