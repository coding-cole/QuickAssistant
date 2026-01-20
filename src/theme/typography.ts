import { TextStyle, Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto',
    semiBold: 'Roboto',
    bold: 'Roboto',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
});

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 32,
  hero: 40,
} as const;

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  hero: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.hero * lineHeight.tight,
  } as TextStyle,
  h1: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
  } as TextStyle,
  h2: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
  } as TextStyle,
  h3: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  } as TextStyle,
  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.normal,
  } as TextStyle,
  body: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,
  bodySmall: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: 0.5,
  } as TextStyle,
  button: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
    letterSpacing: 0.25,
  } as TextStyle,
};

export type TypographyVariant = keyof typeof typography;
