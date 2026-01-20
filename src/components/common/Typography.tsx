import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme, TypographyVariant } from '@theme';

interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'disabled' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const textColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return theme.colors.text;
      case 'secondary':
        return theme.colors.textSecondary;
      case 'disabled':
        return theme.colors.textDisabled;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.text;
    }
  }, [theme, color]);

  return (
    <RNText
      style={[theme.typography[variant], { color: textColor, textAlign: align }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};
