import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { AuthStackScreenProps } from '@app-types/navigation.types';
import { useTheme, Theme } from '@theme';
import { useLoginMutation } from '@api/authApi';
import { Button, Input, Typography } from '@components/common';
import { AuthHeader } from '@components/headers';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;
type NavigationProp = AuthStackScreenProps<'Login'>['navigation'];

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<NavigationProp>();

  const [login, { isLoading, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        await login(data).unwrap();
      } catch {
        // Error is handled by RTK Query
      }
    },
    [login]
  );

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword', {});
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const errorMessage = error
    ? 'data' in error
      ? (error.data as any)?.message
      : 'Login failed'
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        title="Welcome Back"
        description="Sign in to continue to QuickAssistant"
        showBackButton={false}
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
                  accessibilityLabel="Email input"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  leftIcon="lock-closed-outline"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                  accessibilityLabel="Password input"
                />
              )}
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
              accessibilityRole="link"
            >
              <Typography variant="bodySmall" color="secondary">
                Forgot Password?
              </Typography>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              testID="login-button"
            />
          </View>

          <View style={styles.footer}>
            <Typography variant="body" color="secondary">
              Don't have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={handleRegister} accessibilityRole="link">
              <Typography variant="body" style={{ color: theme.colors.primary }}>
                Sign Up
              </Typography>
            </TouchableOpacity>
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
    errorContainer: {
      backgroundColor: `${theme.colors.error}20`,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    form: {
      marginBottom: theme.spacing.xl,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default LoginScreen;
