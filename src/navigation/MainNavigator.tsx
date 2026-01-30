import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '@app-types/navigation.types';
import { useTheme } from '@theme';

// Navigators
import { HomeNavigator } from './HomeNavigator';

// Screens
import RideHistoryScreen from '@screens/Rides/RideHistoryScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';
import MapScreen from '@screens/Map/MapScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'RideHistory':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen
        name="RideHistory"
        component={RideHistoryScreen}
        options={{ tabBarLabel: 'Rides' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
