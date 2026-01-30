export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
  type: 'recent' | 'saved' | 'search';
}

export interface Route {
  id: string;
  origin: Location;
  destination: Location;
  distance: number; // in meters
  duration: number; // in minutes
  polyline?: string; // encoded polyline for the route
}

export interface TrafficInfo {
  level: 'low' | 'moderate' | 'heavy';
  description: string;
  estimatedDelay: number; // in minutes
}

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
  icon: 'home' | 'briefcase' | 'star' | 'location';
  label?: string;
}
