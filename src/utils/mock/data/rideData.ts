import { Ride, RideProvider } from '@components/common';
import { TRANSPORT_PROVIDERS } from './transportData';

// Create provider for rides
const createRideProvider = (key: keyof typeof TRANSPORT_PROVIDERS): RideProvider => {
  const config = TRANSPORT_PROVIDERS[key];
  return {
    name: config.name,
    logo: config.logo || {
      uri: `https://ui-avatars.com/api/?name=${config.name}&background=${config.color.replace('#', '')}&color=fff&size=80`,
    },
  };
};

// Calendar provider for scheduled events
const calendarProvider: RideProvider = {
  name: 'Calendar',
  logo: { uri: 'https://ui-avatars.com/api/?name=Calendar&background=00A3E0&color=fff&size=80' },
};

export const mockRides: Ride[] = [
  {
    id: '1',
    provider: createRideProvider('indrive'),
    title: 'inDrive ride',
    subtitle: 'Victoria Island to Lekki Phase 1',
    timestamp: '2025-10-26T21:38:18',
    status: 'completed',
  },
  {
    id: '2',
    provider: createRideProvider('bolt'),
    title: 'Bolt ride to Lekki',
    subtitle: 'Ikeja to Lekki Phase 1',
    timestamp: '2025-10-26T19:33:26',
    status: 'completed',
  },
  {
    id: '3',
    provider: calendarProvider,
    title: 'Scheduled Sunday ride',
    subtitle: 'Home to Faith Tabernacle, Ota',
    timestamp: '2025-10-26T20:33:26',
    status: 'scheduled',
  },
  {
    id: '4',
    provider: createRideProvider('uber'),
    title: 'Uber ride to VI',
    subtitle: 'Surulere to Victoria Island',
    timestamp: '2025-10-25T14:20:00',
    status: 'cancelled',
  },
  {
    id: '5',
    provider: createRideProvider('bolt'),
    title: 'Bolt ride to Ikeja',
    subtitle: 'Yaba to Ikeja City Mall',
    timestamp: '2025-10-25T10:15:00',
    status: 'completed',
  },
];

export const getRidesByStatus = (status?: 'completed' | 'scheduled' | 'cancelled'): Ride[] => {
  if (!status) return mockRides;
  return mockRides.filter((r) => r.status === status);
};
