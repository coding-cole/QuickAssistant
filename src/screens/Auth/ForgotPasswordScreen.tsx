import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { AuthStackScreenProps } from '@app-types/navigation.types';
import { useTheme, Theme } from '@theme';
import { useForgotPasswordMutation } from '@api/authApi';
import { Button, Input, Typography } from '@components/common';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '@components/headers';
import { getApiErrorMessage } from '@utils/apiErrors';

export type ForgotPasswordParams = {
  email?: string;
};

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
type NavigationProp = AuthStackScreenProps<'ForgotPassword'>['navigation'];
type RouteProp = AuthStackScreenProps<'ForgotPassword'>['route'];

const ForgotPasswordScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: route.params?.email || '' },
  });

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        await forgotPassword(data).unwrap();
        setIsSuccess(true);
      } catch {
        // Error is handled by RTK Query
      }
    },
    [forgotPassword]
  );

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const errorMessage = getApiErrorMessage(error, 'Failed to send reset email');

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-outline" size={64} color={theme.colors.primary} />
          </View>
          <Typography variant="h2" align="center">
            Check Your Email
          </Typography>
          <Typography variant="body" color="secondary" align="center" style={styles.successMessage}>
            We've sent password reset instructions to your email address. Please check your inbox
            and follow the link to reset your password.
          </Typography>
          <Button title="Back to Sign In" onPress={handleBackToLogin} fullWidth variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        title="Forgot Password?"
        description="Enter your email address and we'll send you instructions to reset your password."
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Typography variant="bodySmall" color="error">
                {errorMessage}
              </Typography>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  leftIcon="mail-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              testID="forgot-password-button"
            />

            <Button
              title="Back to Sign In"
              onPress={handleBackToLogin}
              fullWidth
              variant="ghost"
              style={styles.backButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      justifyContent: 'center',
    },
    header: {
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    backButton: {
      alignSelf: 'flex-start',
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    errorContainer: {
      backgroundColor: `${theme.colors.error}20`,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    form: {
      gap: theme.spacing.md,
    },
    successContent: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    successIcon: {
      marginBottom: theme.spacing.lg,
    },
    successMessage: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
  });

export default ForgotPasswordScreen;
