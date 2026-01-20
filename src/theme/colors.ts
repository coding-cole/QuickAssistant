export const palette = {
  // Primary colors
  primary100: '#E3F2FD',
  primary200: '#90CAF9',
  primary300: '#64B5F6',
  primary400: '#42A5F5',
  primary500: '#2196F3',
  primary600: '#1E88E5',
  primary700: '#1976D2',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Transparent
  transparent: 'transparent',
} as const;

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  notification: string;
}

export const lightColors: ThemeColors = {
  primary: palette.primary500,
  primaryLight: palette.primary300,
  primaryDark: palette.primary700,
  secondary: palette.gray700,
  background: palette.gray50,
  surface: palette.white,
  card: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textDisabled: palette.gray400,
  border: palette.gray300,
  divider: palette.gray200,
  error: palette.error,
  success: palette.success,
  warning: palette.warning,
  info: palette.info,
  notification: palette.error,
};

export const darkColors: ThemeColors = {
  primary: palette.primary400,
  primaryLight: palette.primary200,
  primaryDark: palette.primary600,
  secondary: palette.gray300,
  background: '#121212',
  surface: '#1E1E1E',
  card: '#252525',
  text: palette.gray100,
  textSecondary: palette.gray400,
  textDisabled: palette.gray600,
  border: palette.gray700,
  divider: palette.gray800,
  error: '#CF6679',
  success: '#81C784',
  warning: '#FFB74D',
  info: '#64B5F6',
  notification: '#CF6679',
};
