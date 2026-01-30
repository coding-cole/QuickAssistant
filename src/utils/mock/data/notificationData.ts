import { Notification } from '@components/common';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Upcoming Event',
    description: 'Team Sync starts at 9:00 AM. Would you like travel suggestions?',
    timestamp: '2025-10-26T21:23:00',
    isUnread: true,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Scheduled Ride Reminder',
    description: 'Your church ride is scheduled for Sunday at 7:35 AM',
    timestamp: '2025-10-26T21:03:00',
    isUnread: true,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Traffic Alert',
    description: 'Heavy traffic on Lekki-Epe Expressway. Consider leaving earlier.',
    timestamp: '2025-10-26T20:33:00',
    isUnread: true,
  },
  {
    id: '4',
    type: 'event',
    title: 'Meeting Tomorrow',
    description: 'Client presentation at Victoria Island office at 10:00 AM',
    timestamp: '2025-10-26T18:00:00',
    isUnread: false,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Weekly Summary',
    description: 'You saved ₦4,500 this week using QuickAssistant recommendations',
    timestamp: '2025-10-26T12:00:00',
    isUnread: false,
  },
];

export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter((n) => n.isUnread);
};

export const getUnreadCount = (): number => {
  return mockNotifications.filter((n) => n.isUnread).length;
};
