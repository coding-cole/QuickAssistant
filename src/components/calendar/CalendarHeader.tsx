import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { format } from 'date-fns';

type ViewMode = 'month' | 'week';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  style?: StyleProp<ViewStyle>;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getDisplayTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    }
    return format(currentDate, 'MMM d, yyyy');
  };

  return (
    <View style={[styles.container, style]}>
      {/* Navigation row */}
      <View style={styles.navigationRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrevious}
          accessibilityLabel="Previous"
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.titleContainer} onPress={onToday}>
          <Typography variant="h3" style={styles.title}>
            {getDisplayTitle()}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onNext} accessibilityLabel="Next">
          <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* View mode toggle and Today button */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.todayButton} onPress={onToday}>
          <Typography variant="bodySmall" style={styles.todayButtonText}>
            Today
          </Typography>
        </TouchableOpacity>

        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('week')}
          >
            <Typography
              variant="caption"
              style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}
            >
              Week
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('month')}
          >
            <Typography
              variant="caption"
              style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}
            >
              Month
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    navigationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navButton: {
      padding: theme.spacing.xs,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
    },
    todayButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    todayButtonText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semiBold,
    },
    viewModeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: 2,
    },
    viewModeButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    viewModeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    viewModeText: {
      color: theme.colors.textSecondary,
    },
    viewModeTextActive: {
      color: theme.colors.background,
      fontWeight: theme.fontWeight.semiBold,
    },
  });

export default CalendarHeader;
