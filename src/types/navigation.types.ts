import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { ChatParams } from '@screens/Chat/ChatScreen';
import { PriceComparisonParams } from '@screens/Rides/PriceComparisonScreen';
import { CalendarParams } from '@screens/Calendar/CalendarScreen';

// Home Stack (screens accessible from Home tab)
export type HomeStackParamList = {
  HomeMain: undefined;
  Chat: ChatParams;
  PriceComparison: PriceComparisonParams;
  Notifications: undefined;
  Calendar: CalendarParams;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  RideHistory: undefined;
  Settings: undefined;
};

// Root Stack
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Screen Props Types
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Global type declaration for useNavigation hook
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace ReactNavigation {
    // eslint-disable-next-line no-unused-vars
    interface RootParamList extends RootStackParamList {}
  }
}
