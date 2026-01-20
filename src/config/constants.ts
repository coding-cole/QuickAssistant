export const APP_NAME = 'QuickAssistant';

export const ASYNC_STORAGE_KEYS = {
  AUTH_TOKEN: '@QuickAssistant:authToken',
  REFRESH_TOKEN: '@QuickAssistant:refreshToken',
  USER_PREFERENCES: '@QuickAssistant:userPreferences',
  THEME: '@QuickAssistant:theme',
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
