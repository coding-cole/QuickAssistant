export const APP_NAME = 'QuickAssistant';

export const TRIP_ESTIMATION_BASE_URL_DEFAULT = `https://thumbzilla-proceed-solaris-earthquake.trycloudflare.com`;
export const TRIP_ESTIMATION_PATH = `/process/sendTrip`;
export const TRIP_ESTIMATION_URL = `${TRIP_ESTIMATION_BASE_URL_DEFAULT}${TRIP_ESTIMATION_PATH}`;

export const ASYNC_STORAGE_KEYS = {
  USER_PREFERENCES: '@QuickAssistant:userPreferences',
  THEME: '@QuickAssistant:theme',
  CHAT_HISTORY: '@QuickAssistant:chatHistory',
  ESTIMATION_BASE_URL: '@QuickAssistant:estimationBaseUrl',
  ESTIMATION_USE_MOCK: '@QuickAssistant:estimationUseMock',
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 255,
} as const;

export const TIMEOUTS = {
  API_REQUEST: 30000,
  DEBOUNCE: 500,
  TOAST_DURATION: 3000,
} as const;
