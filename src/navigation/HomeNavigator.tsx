import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@app-types/navigation.types';
import { useTheme } from '@theme';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeMainScreen from '@screens/Home/HomeMainScreen';
import ChatScreen from '@screens/Chat/ChatScreen';
import PriceComparisonScreen from '@screens/Rides/PriceComparisonScreen';
import NotificationsScreen from '@screens/Notifications/NotificationsScreen';

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
      <Stack.Screen
        name="HomeMain"
        component={HomeMainScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'QuickAssistant',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              accessibilityLabel="Notifications"
              style={{ paddingHorizontal: 8 }}
            >
              <Ionicons name="notifications-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ),
        })}
      />
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
    </Stack.Navigator>
  );
};
