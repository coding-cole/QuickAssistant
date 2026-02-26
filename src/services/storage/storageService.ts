import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '@config/constants';

export const storageService = {
  // Estimation Base URL
  getEstimationBaseUrl: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ESTIMATION_BASE_URL);
    } catch (error) {
      console.error('Error getting estimation base URL:', error);
      return null;
    }
  },

  setEstimationBaseUrl: async (url: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ESTIMATION_BASE_URL, url);
    } catch (error) {
      console.error('Error setting estimation base URL:', error);
    }
  },

  getEstimationUseMock: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ESTIMATION_USE_MOCK);
      return value === 'true';
    } catch (error) {
      console.error('Error getting estimation mock flag:', error);
      return false;
    }
  },

  setEstimationUseMock: async (enabled: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.ESTIMATION_USE_MOCK,
        enabled ? 'true' : 'false'
      );
    } catch (error) {
      console.error('Error setting estimation mock flag:', error);
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
};
