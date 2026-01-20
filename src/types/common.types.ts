import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface BaseComponentProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export interface BaseTextProps {
  testID?: string;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}
