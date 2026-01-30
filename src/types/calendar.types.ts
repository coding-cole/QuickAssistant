export type EventType = 'meeting' | 'ride' | 'reminder' | 'personal' | 'work';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  type: EventType;
  status: EventStatus;
  color?: string;
  hasRideBooked?: boolean;
  rideDetails?: {
    provider: string;
    pickupTime: string;
    estimatedPrice: number;
  };
}

export interface DayEvents {
  date: string; // YYYY-MM-DD format
  events: CalendarEvent[];
}

export interface CalendarViewMode {
  mode: 'month' | 'week' | 'day';
}
