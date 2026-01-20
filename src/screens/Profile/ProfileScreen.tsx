import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '@theme';
import { useAppSelector, useAppDispatch, logout } from '@state';
import { selectUser, selectUserFullName, selectUserInitials } from '@state/selectors/authSelectors';
import { useLogoutMutation } from '@api/authApi';
import { storageService } from '@services/storage';
import { Typography, Card, Button } from '@components/common';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const fullName = useAppSelector(selectUserFullName);
  const initials = useAppSelector(selectUserInitials);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutApi().unwrap();
          } catch {
            // API call failed, but still logout locally
          } finally {
            await storageService.clearAuthData();
            dispatch(logout());
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2">Profile</Typography>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {initials ? (
                <Typography variant="h2" style={styles.avatarText}>
                  {initials}
                </Typography>
              ) : (
                <Ionicons name="person" size={40} color={theme.colors.textSecondary} />
              )}
            </View>
          </View>
          <Typography variant="h3" align="center">
            {fullName || 'Guest User'}
          </Typography>
          {user?.email && (
            <Typography variant="body" color="secondary" align="center">
              {user.email}
            </Typography>
          )}
        </Card>

        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Typography variant="body">Edit Profile</Typography>
              <Typography variant="caption" color="secondary">
                Update your personal information
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Typography variant="body">Notifications</Typography>
              <Typography variant="caption" color="secondary">
                Manage notification preferences
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Typography variant="body">Privacy & Security</Typography>
              <Typography variant="caption" color="secondary">
                Manage your account security
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Typography variant="body">Help & Support</Typography>
              <Typography variant="caption" color="secondary">
                Get help or contact support
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </Card>

        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            loading={isLoggingOut}
            textStyle={{ color: theme.colors.error }}
            style={{ borderColor: theme.colors.error }}
          />
        </View>

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
    profileCard: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },
    avatarContainer: {
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: theme.colors.primary,
    },
    card: {
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    menuContent: {
      flex: 1,
    },
    logoutSection: {
      marginTop: theme.spacing.xl,
    },
    version: {
      marginTop: theme.spacing.lg,
    },
  });

export default ProfileScreen;
