import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { Typography, Card } from '@components/common';
import { storageService } from '@services/storage';
import { TRIP_ESTIMATION_BASE_URL_DEFAULT } from '@config/constants';

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [baseUrl, setBaseUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    storageService.getEstimationBaseUrl().then((url) => {
      if (url) {
        setSavedUrl(url);
        setBaseUrl(url);
      }
    });
  }, []);

  const handleSave = async () => {
    const trimmed = baseUrl.trim();
    if (!trimmed) {
      Alert.alert('Invalid URL', 'Please enter a valid base URL.');
      return;
    }
    setIsSaving(true);
    try {
      await storageService.setEstimationBaseUrl(trimmed);
      setSavedUrl(trimmed);
      Alert.alert('Saved', 'Estimation base URL updated.');
    } catch {
      Alert.alert('Error', 'Failed to save URL. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    Alert.alert('Reset URL', 'Reset to the default base URL?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: async () => {
          await storageService.setEstimationBaseUrl(TRIP_ESTIMATION_BASE_URL_DEFAULT);
          setSavedUrl(TRIP_ESTIMATION_BASE_URL_DEFAULT);
          setBaseUrl(TRIP_ESTIMATION_BASE_URL_DEFAULT);
        },
      },
    ]);
  };

  const activeUrl = savedUrl || TRIP_ESTIMATION_BASE_URL_DEFAULT;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Typography variant="h2">Settings</Typography>
        </View>

        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="server-outline" size={20} color={theme.colors.primary} />
            </View>
            <Typography variant="h4">Configuration</Typography>
          </View>

          <Typography variant="caption" color="secondary" style={styles.label}>
            Estimation base URL
          </Typography>
          <Typography
            variant="caption"
            color="secondary"
            style={styles.activeUrl}
            numberOfLines={2}
          >
            Active: {activeUrl}
          </Typography>

          <TextInput
            style={styles.input}
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder={TRIP_ESTIMATION_BASE_URL_DEFAULT}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Typography variant="body" style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Typography variant="body" style={styles.resetButtonText}>
                Reset
              </Typography>
            </TouchableOpacity>
          </View>
        </Card>

        <Typography variant="caption" color="secondary" align="center" style={styles.version}>
          QuickAssistant v1.0.0
        </Typography>
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
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    card: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    label: {
      marginBottom: theme.spacing.xs,
    },
    activeUrl: {
      marginBottom: theme.spacing.sm,
      fontStyle: 'italic',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.sm,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      fontSize: 13,
      marginBottom: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      color: '#fff',
    },
    resetButton: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    resetButtonText: {
      color: theme.colors.textSecondary,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    version: {
      marginTop: theme.spacing.lg,
    },
  });

export default SettingsScreen;
