import { IS_DEV } from '@config/env';

type EventParams = Record<string, string | number | boolean>;

export const analyticsService = {
  logEvent: async (eventName: string, params?: EventParams): Promise<void> => {
    if (IS_DEV) {
      console.warn(`[Analytics] Event: ${eventName}`, params);
    }
    // TODO: Implement actual analytics (Firebase, Mixpanel, etc.)
  },

  logScreenView: async (screenName: string): Promise<void> => {
    if (IS_DEV) {
      console.warn(`[Analytics] Screen View: ${screenName}`);
    }
    // TODO: Implement actual screen tracking
  },

  setUserId: async (userId: string): Promise<void> => {
    if (IS_DEV) {
      console.warn(`[Analytics] Set User ID: ${userId}`);
    }
    // TODO: Implement user identification
  },

  clearUserId: async (): Promise<void> => {
    if (IS_DEV) {
      console.warn('[Analytics] Clear User ID');
    }
    // TODO: Implement clearing user identification
  },

  setUserProperty: async (name: string, value: string): Promise<void> => {
    if (IS_DEV) {
      console.warn(`[Analytics] User Property: ${name} = ${value}`);
    }
    // TODO: Implement user properties
  },

  logError: async (error: Error, context?: string): Promise<void> => {
    if (IS_DEV) {
      console.error(`[Analytics] Error${context ? ` (${context})` : ''}:`, error);
    }
    // TODO: Implement error logging (Sentry, Crashlytics, etc.)
  },
};
