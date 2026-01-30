import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateString: string, formatStr: string = 'MMM d, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// QuickAssistant specific formatters

/**
 * Format amount in Naira with thousands separator
 * @example formatNairaPrice(3200) → "₦3,200"
 */
export const formatNairaPrice = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

/**
 * Format timestamp to "Oct 26, 09:23 PM"
 */
export const formatNotificationTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    return format(date, 'MMM d, h:mm a');
  } catch {
    return timestamp;
  }
};

/**
 * Format timestamp to "26/10/2025, 21:38:18"
 */
export const formatFullTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    return format(date, 'dd/MM/yyyy, HH:mm:ss');
  } catch {
    return timestamp;
  }
};

/**
 * Format time only "21:37"
 */
export const formatTime = (timestamp: string | Date): string => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    return format(date, 'HH:mm');
  } catch {
    return typeof timestamp === 'string' ? timestamp : '';
  }
};

/**
 * Format minutes to "35 min" or "1 hr 15 min"
 */
export const formatETA = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
};
