import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '@config/constants';

export const storageService = {
  // Auth Token
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  setAuthToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },

  removeAuthToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  },

  // Refresh Token
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  },

  removeRefreshToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },

  // Generic methods
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  multiRemove: async (keys: string[]): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing multiple items:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Clear all auth related data
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        ASYNC_STORAGE_KEYS.AUTH_TOKEN,
        ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};
