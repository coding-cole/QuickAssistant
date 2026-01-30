import { Location, SavedPlace, TrafficInfo, Route } from '@app-types/map.types';

// Lagos center coordinates
export const LAGOS_CENTER = {
  latitude: 6.5244,
  longitude: 3.3792,
};

// Default map region for Lagos
export const DEFAULT_REGION = {
  ...LAGOS_CENTER,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Popular locations in Lagos
export const POPULAR_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Lekki Phase 1',
    address: 'Lekki Phase 1, Lagos',
    coordinate: { latitude: 6.4478, longitude: 3.4723 },
    type: 'search',
  },
  {
    id: 'loc-2',
    name: 'Victoria Island',
    address: 'Victoria Island, Lagos',
    coordinate: { latitude: 6.4281, longitude: 3.4219 },
    type: 'search',
  },
  {
    id: 'loc-3',
    name: 'Ikeja',
    address: 'Ikeja, Lagos',
    coordinate: { latitude: 6.6018, longitude: 3.3515 },
    type: 'search',
  },
  {
    id: 'loc-4',
    name: 'Ikoyi',
    address: 'Ikoyi, Lagos',
    coordinate: { latitude: 6.4549, longitude: 3.4366 },
    type: 'search',
  },
  {
    id: 'loc-5',
    name: 'Surulere',
    address: 'Surulere, Lagos',
    coordinate: { latitude: 6.5059, longitude: 3.3509 },
    type: 'search',
  },
  {
    id: 'loc-6',
    name: 'Yaba',
    address: 'Yaba, Lagos',
    coordinate: { latitude: 6.5158, longitude: 3.3762 },
    type: 'search',
  },
  {
    id: 'loc-7',
    name: 'Ajah',
    address: 'Ajah, Lagos',
    coordinate: { latitude: 6.4698, longitude: 3.5852 },
    type: 'search',
  },
  {
    id: 'loc-8',
    name: 'Marina',
    address: 'Marina, Lagos Island',
    coordinate: { latitude: 6.4474, longitude: 3.3903 },
    type: 'search',
  },
];

// Recent locations for the user
export const mockRecentLocations: Location[] = [
  {
    id: 'recent-1',
    name: 'Tech Hub Victoria Island',
    address: '42 Saka Tinubu St, Victoria Island, Lagos',
    coordinate: { latitude: 6.4281, longitude: 3.4219 },
    type: 'recent',
  },
  {
    id: 'recent-2',
    name: 'Landmark Event Centre',
    address: 'Plot 2 & 3 Water Corporation Rd, Victoria Island',
    coordinate: { latitude: 6.4234, longitude: 3.4156 },
    type: 'recent',
  },
  {
    id: 'recent-3',
    name: 'The Palms Shopping Mall',
    address: '1 Bisway St, Lekki Phase 1, Lagos',
    coordinate: { latitude: 6.4312, longitude: 3.4523 },
    type: 'recent',
  },
  {
    id: 'recent-4',
    name: 'Murtala Muhammed International Airport',
    address: 'Ikeja, Lagos',
    coordinate: { latitude: 6.5774, longitude: 3.3212 },
    type: 'recent',
  },
];

// Saved places
export const mockSavedPlaces: SavedPlace[] = [
  {
    id: 'saved-1',
    name: 'Home',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    coordinate: { latitude: 6.4478, longitude: 3.4723 },
    icon: 'home',
    label: 'Home',
  },
  {
    id: 'saved-2',
    name: 'Work',
    address: 'Tech Hub, 42 Saka Tinubu St, Victoria Island',
    coordinate: { latitude: 6.4281, longitude: 3.4219 },
    icon: 'briefcase',
    label: 'Work',
  },
  {
    id: 'saved-3',
    name: 'Gym',
    address: 'Fitness Plus, 28 Awolowo Rd, Ikoyi',
    coordinate: { latitude: 6.4549, longitude: 3.4366 },
    icon: 'star',
    label: 'Gym',
  },
  {
    id: 'saved-4',
    name: 'Church',
    address: 'Faith Tabernacle, Canaanland, Ota',
    coordinate: { latitude: 6.6782, longitude: 3.1582 },
    icon: 'star',
    label: 'Church',
  },
];

// Traffic information for major routes
export const mockTrafficInfo: Record<string, TrafficInfo> = {
  'lekki-vi': {
    level: 'heavy',
    description: 'Heavy traffic on Lekki-Epe Expressway',
    estimatedDelay: 25,
  },
  'vi-ikeja': {
    level: 'moderate',
    description: 'Moderate traffic on Third Mainland Bridge',
    estimatedDelay: 15,
  },
  'ikoyi-lekki': {
    level: 'low',
    description: 'Light traffic via Falomo Bridge',
    estimatedDelay: 5,
  },
  'surulere-vi': {
    level: 'heavy',
    description: 'Heavy traffic on Eko Bridge',
    estimatedDelay: 30,
  },
};

// Convert SavedPlace to Location
const savedPlaceToLocation = (place: SavedPlace): Location => ({
  id: place.id,
  name: place.name,
  address: place.address,
  coordinate: place.coordinate,
  type: 'saved',
});

// Sample routes
export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    origin: savedPlaceToLocation(mockSavedPlaces[0]), // Home
    destination: savedPlaceToLocation(mockSavedPlaces[1]), // Work
    distance: 8500, // 8.5 km
    duration: 35,
  },
  {
    id: 'route-2',
    origin: savedPlaceToLocation(mockSavedPlaces[1]), // Work
    destination: mockRecentLocations[2], // The Palms
    distance: 5200, // 5.2 km
    duration: 20,
  },
];

// Helper functions
export const getRecentLocations = (): Location[] => {
  return mockRecentLocations;
};

export const getSavedPlaces = (): SavedPlace[] => {
  return mockSavedPlaces;
};

export const searchLocations = (query: string): Location[] => {
  const searchTerm = query.toLowerCase();
  return POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm) || loc.address.toLowerCase().includes(searchTerm)
  );
};

export const getTrafficForRoute = (originId: string, destId: string): TrafficInfo | null => {
  // Simplified traffic lookup
  const routeKey = `${originId}-${destId}`.toLowerCase();
  return mockTrafficInfo[routeKey] || null;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getTrafficLevelColor = (level: TrafficInfo['level']): string => {
  switch (level) {
    case 'low':
      return '#4CAF50';
    case 'moderate':
      return '#FF9800';
    case 'heavy':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};
