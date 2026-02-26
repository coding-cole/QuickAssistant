import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { MainTabParamList } from '@app-types/navigation.types';
import { useTheme } from '@theme';

// Navigators
import { HomeNavigator } from './HomeNavigator';

// Screens
import RideHistoryScreen from '@screens/Rides/RideHistoryScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import MapScreen from '@screens/Map/MapScreen';
import CalendarScreen from '@screens/Calendar/CalendarScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();

  const getTabBarStyle = (route: {
    name: string;
    state?: { index: number; routes: unknown[] };
  }) => {
    const focusedRoute = getFocusedRouteNameFromRoute(route) ?? '';
    const hideTabs = focusedRoute === 'Chat' || focusedRoute === 'PriceComparison';

    return {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      display: hideTabs ? 'none' : 'flex',
    } as const;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: getTabBarStyle(route),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'CalendarTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'RideHistory':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
          headerShown: true,
          title: 'Calendar',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          headerShown: true,
          title: 'Smart Navigation',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Tab.Screen
        name="RideHistory"
        component={RideHistoryScreen}
        options={{
          tabBarLabel: 'Rides',
          headerShown: true,
          title: 'Ride History',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
    </Tab.Navigator>
  );
};
