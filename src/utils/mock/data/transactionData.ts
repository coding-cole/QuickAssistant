import { Transaction, TransactionProvider } from '@components/common';
import { TRANSPORT_PROVIDERS } from './transportData';

// Create provider for transactions
const createTransactionProvider = (key: keyof typeof TRANSPORT_PROVIDERS): TransactionProvider => {
  const config = TRANSPORT_PROVIDERS[key];
  return {
    name: config.name,
    logo: config.logo || {
      uri: `https://ui-avatars.com/api/?name=${config.name}&background=${config.color.replace('#', '')}&color=fff&size=80`,
    },
  };
};

// Calendar provider for scheduled events
const calendarProvider: TransactionProvider = {
  name: 'Calendar',
  logo: { uri: 'https://ui-avatars.com/api/?name=Calendar&background=00A3E0&color=fff&size=80' },
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    provider: createTransactionProvider('indrive'),
    title: 'inDrive ride',
    subtitle: 'Booked inDrive for ₦2,800',
    amount: 2800,
    timestamp: '2025-10-26T21:38:18',
    status: 'completed',
  },
  {
    id: '2',
    provider: createTransactionProvider('bolt'),
    title: 'Bolt ride to Lekki',
    subtitle: 'Completed trip to Lekki Phase 1',
    amount: 3200,
    timestamp: '2025-10-26T19:33:26',
    status: 'completed',
  },
  {
    id: '3',
    provider: calendarProvider,
    title: 'Scheduled Sunday ride',
    subtitle: 'Church service at Faith Tabernacle',
    amount: 2800,
    timestamp: '2025-10-26T20:33:26',
    status: 'scheduled',
  },
  {
    id: '4',
    provider: createTransactionProvider('uber'),
    title: 'Uber ride to VI',
    subtitle: 'Trip cancelled by driver',
    amount: 3500,
    timestamp: '2025-10-25T14:20:00',
    status: 'cancelled',
  },
  {
    id: '5',
    provider: createTransactionProvider('bolt'),
    title: 'Bolt ride to Ikeja',
    subtitle: 'Completed trip to Ikeja City Mall',
    amount: 4200,
    timestamp: '2025-10-25T10:15:00',
    status: 'completed',
  },
];

export const getTransactionsByStatus = (
  status?: 'completed' | 'scheduled' | 'cancelled'
): Transaction[] => {
  if (!status) return mockTransactions;
  return mockTransactions.filter((t) => t.status === status);
};
