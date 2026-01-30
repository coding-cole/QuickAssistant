import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@app-types/navigation.types';
import { useTheme } from '@theme';

// Screens
import HomeMainScreen from '@screens/Home/HomeMainScreen';
import ChatScreen from '@screens/Chat/ChatScreen';
import PriceComparisonScreen from '@screens/Rides/PriceComparisonScreen';
import NotificationsScreen from '@screens/Notifications/NotificationsScreen';
import CalendarScreen from '@screens/Calendar/CalendarScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeMainScreen} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
          title: 'QuickAssistant',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="PriceComparison"
        component={PriceComparisonScreen}
        options={{
          headerShown: true,
          title: 'Available Options',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Notifications',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: true,
          title: 'Calendar',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
    </Stack.Navigator>
  );
};
