import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (elevation: number, shadowOpacity: number = 0.25): ShadowStyle => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity,
      shadowRadius: elevation,
    },
    android: {
      elevation,
    },
    default: {},
  }) as ShadowStyle;
};

export const shadows = {
  none: createShadow(0, 0),
  sm: createShadow(2, 0.1),
  md: createShadow(4, 0.15),
  lg: createShadow(8, 0.2),
  xl: createShadow(16, 0.25),
} as const;

export type Shadow = keyof typeof shadows;
