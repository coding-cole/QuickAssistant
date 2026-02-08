import { TransportOption, TransportProvider } from '@components/common';
import { ImageSourcePropType } from 'react-native';

// Provider configuration with colors
export interface ProviderConfig {
  name: string;
  color: string;
  logo?: ImageSourcePropType;
}

export const TRANSPORT_PROVIDERS: Record<string, ProviderConfig> = {
  bolt: {
    name: 'Bolt',
    color: '#34D186',
  },
  uber: {
    name: 'Uber',
    color: '#000000',
  },
  indrive: {
    name: 'inDrive',
    color: '#FF6B00',
  },
  brt: {
    name: 'BRT',
    color: '#00A3E0',
  },
  metro: {
    name: 'Lagos Metro',
    color: '#2E75B5',
  },
};

// Create provider object with fallback handling
const createProvider = (key: keyof typeof TRANSPORT_PROVIDERS): TransportProvider => {
  const config = TRANSPORT_PROVIDERS[key];
  return {
    name: config.name,
    logo: config.logo || {
      uri: `https://ui-avatars.com/api/?name=${config.name}&background=${config.color.replace('#', '')}&color=fff&size=96`,
    },
    color: config.color,
  };
};

export const mockTransportOptions: TransportOption[] = [
  {
    provider: createProvider('bolt'),
    price: 3200,
    eta: 35,
    seats: 4,
    badge: 'recommended',
  },
  {
    provider: createProvider('indrive'),
    price: 2800,
    eta: 35,
    seats: 4,
    badge: 'cheapest',
  },
  {
    provider: createProvider('uber'),
    price: 3500,
    eta: 30,
    seats: 4,
    badge: 'fastest',
  },
];

export const getTransportOptionsForRoute = (
  _origin: string,
  _destination: string
): TransportOption[] => {
  // In a real app, this would call actual APIs
  // For now, return mock data with some variance
  return mockTransportOptions.map((option) => ({
    ...option,
    price: Math.max(500, option.price + Math.floor(Math.random() * 500 - 250)),
    eta: Math.max(5, option.eta + Math.floor(Math.random() * 10 - 5)),
  }));
};
