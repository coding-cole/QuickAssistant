import { CalendarEvent, DayEvents } from '@app-types/calendar.types';
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isToday,
  isTomorrow,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

// Helper to create ISO date strings relative to today
const getRelativeDate = (daysFromNow: number, hours: number, minutes: number = 0): string => {
  const date = addDays(new Date(), daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockCalendarEvents: CalendarEvent[] = [
  // Today's events
  {
    id: '1',
    title: 'Team Sync Meeting',
    description: 'Weekly sync with the product team to discuss sprint progress',
    location: 'Tech Hub, Victoria Island',
    startTime: getRelativeDate(0, 9, 0),
    endTime: getRelativeDate(0, 10, 0),
    type: 'work',
    status: 'upcoming',
    hasRideBooked: true,
    rideDetails: {
      provider: 'Bolt',
      pickupTime: getRelativeDate(0, 8, 15),
      estimatedPrice: 2800,
    },
  },
  {
    id: '2',
    title: 'Lunch with Client',
    description: 'Business lunch to discuss Q1 partnership',
    location: 'The Grill, Lekki Phase 1',
    startTime: getRelativeDate(0, 12, 30),
    endTime: getRelativeDate(0, 14, 0),
    type: 'work',
    status: 'upcoming',
    hasRideBooked: false,
  },
  {
    id: '3',
    title: 'Gym Session',
    description: 'Personal training session',
    location: 'Fitness Plus, Ikoyi',
    startTime: getRelativeDate(0, 18, 0),
    endTime: getRelativeDate(0, 19, 30),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // Tomorrow's events
  {
    id: '4',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    location: 'Reddington Hospital, Victoria Island',
    startTime: getRelativeDate(1, 10, 0),
    endTime: getRelativeDate(1, 11, 0),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: true,
    rideDetails: {
      provider: 'Uber',
      pickupTime: getRelativeDate(1, 9, 15),
      estimatedPrice: 3200,
    },
  },
  {
    id: '5',
    title: 'Project Review',
    description: 'Review milestones with stakeholders',
    location: 'Main Office, Ikeja',
    startTime: getRelativeDate(1, 14, 0),
    endTime: getRelativeDate(1, 16, 0),
    type: 'meeting',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // Day after tomorrow
  {
    id: '6',
    title: 'Coffee with Mentor',
    description: 'Monthly mentorship session',
    location: 'Cafe Neo, Lekki',
    startTime: getRelativeDate(2, 16, 0),
    endTime: getRelativeDate(2, 17, 30),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // In 3 days (Sunday church)
  {
    id: '7',
    title: 'Church Service',
    description: 'Sunday worship service',
    location: 'Faith Tabernacle, Canaanland',
    startTime: getRelativeDate(3, 7, 30),
    endTime: getRelativeDate(3, 11, 0),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: true,
    rideDetails: {
      provider: 'inDrive',
      pickupTime: getRelativeDate(3, 6, 45),
      estimatedPrice: 4500,
    },
  },

  // In 4 days
  {
    id: '8',
    title: 'Sprint Planning',
    description: 'Plan next 2-week sprint tasks',
    location: 'Tech Hub, Victoria Island',
    startTime: getRelativeDate(4, 9, 0),
    endTime: getRelativeDate(4, 11, 0),
    type: 'meeting',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // In 5 days
  {
    id: '9',
    title: 'Dental Cleaning',
    description: 'Routine dental cleaning',
    location: 'Lagos Dental Clinic, Surulere',
    startTime: getRelativeDate(5, 15, 0),
    endTime: getRelativeDate(5, 16, 0),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // In a week
  {
    id: '10',
    title: 'Birthday Party',
    description: "Friend's birthday celebration",
    location: 'Landmark Event Centre, Victoria Island',
    startTime: getRelativeDate(7, 19, 0),
    endTime: getRelativeDate(7, 23, 0),
    type: 'personal',
    status: 'upcoming',
    hasRideBooked: false,
  },

  // Past events (yesterday)
  {
    id: '11',
    title: 'Code Review Session',
    description: 'Reviewed PR for mobile app feature',
    location: 'Remote',
    startTime: getRelativeDate(-1, 14, 0),
    endTime: getRelativeDate(-1, 15, 30),
    type: 'work',
    status: 'completed',
  },
  {
    id: '12',
    title: 'Networking Event',
    description: 'Lagos Tech Meetup',
    location: 'Zone Tech Park, Gbagada',
    startTime: getRelativeDate(-1, 18, 0),
    endTime: getRelativeDate(-1, 21, 0),
    type: 'work',
    status: 'completed',
    hasRideBooked: true,
    rideDetails: {
      provider: 'Bolt',
      pickupTime: getRelativeDate(-1, 17, 15),
      estimatedPrice: 2500,
    },
  },

  // 2 days ago
  {
    id: '13',
    title: 'Cancelled: Team Outing',
    description: 'Was scheduled but cancelled due to weather',
    location: 'Lekki Conservation Centre',
    startTime: getRelativeDate(-2, 10, 0),
    endTime: getRelativeDate(-2, 16, 0),
    type: 'work',
    status: 'cancelled',
  },
];

// Get events for a specific date
export const getEventsForDate = (date: Date): CalendarEvent[] => {
  return mockCalendarEvents.filter((event) => {
    const eventDate = parseISO(event.startTime);
    return isSameDay(eventDate, date);
  });
};

// Get events for today
export const getTodayEvents = (): CalendarEvent[] => {
  return getEventsForDate(new Date());
};

// Get events for tomorrow
export const getTomorrowEvents = (): CalendarEvent[] => {
  return getEventsForDate(addDays(new Date(), 1));
};

// Get upcoming events (next 7 days)
export const getUpcomingEvents = (days: number = 7): CalendarEvent[] => {
  const now = new Date();
  const endDate = addDays(now, days);

  return mockCalendarEvents
    .filter((event) => {
      const eventDate = parseISO(event.startTime);
      return eventDate >= now && eventDate <= endDate && event.status !== 'cancelled';
    })
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
};

// Get events with no ride booked
export const getEventsNeedingRide = (): CalendarEvent[] => {
  return mockCalendarEvents.filter(
    (event) =>
      event.status === 'upcoming' &&
      !event.hasRideBooked &&
      event.location &&
      event.location !== 'Remote'
  );
};

// Get events grouped by day for a date range
export const getEventsGroupedByDay = (startDate: Date, endDate: Date): DayEvents[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((day) => ({
    date: format(day, 'yyyy-MM-dd'),
    events: getEventsForDate(day),
  }));
};

// Get events for current month
export const getCurrentMonthEvents = (): DayEvents[] => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return getEventsGroupedByDay(start, end);
};

// Get events for current week
export const getCurrentWeekEvents = (): DayEvents[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 0 }); // Sunday start
  const end = endOfWeek(now, { weekStartsOn: 0 });
  return getEventsGroupedByDay(start, end);
};

// Get the next event that needs a ride
export const getNextEventNeedingRide = (): CalendarEvent | null => {
  const events = getEventsNeedingRide().sort(
    (a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
  );
  return events[0] || null;
};

// Format event time for display
export const formatEventTime = (startTime: string, endTime: string): string => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  const startFormatted = format(start, 'h:mm a');
  const endFormatted = format(end, 'h:mm a');

  return `${startFormatted} - ${endFormatted}`;
};

// Get relative day label
export const getRelativeDayLabel = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  return format(date, 'EEEE, MMM d');
};

// Count events with booked rides
export const getBookedRidesCount = (): number => {
  return mockCalendarEvents.filter((event) => event.hasRideBooked && event.status === 'upcoming')
    .length;
};

// Get event type configuration
export const getEventTypeConfig = (type: CalendarEvent['type']) => {
  const configs = {
    meeting: {
      icon: 'people-outline' as const,
      color: '#2196F3',
      label: 'Meeting',
    },
    ride: {
      icon: 'car-outline' as const,
      color: '#00A3E0',
      label: 'Ride',
    },
    reminder: {
      icon: 'alarm-outline' as const,
      color: '#FF9800',
      label: 'Reminder',
    },
    personal: {
      icon: 'person-outline' as const,
      color: '#9C27B0',
      label: 'Personal',
    },
    work: {
      icon: 'briefcase-outline' as const,
      color: '#4CAF50',
      label: 'Work',
    },
  };

  return configs[type] || configs.personal;
};
