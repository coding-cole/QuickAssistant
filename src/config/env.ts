import Constants from 'expo-constants';

interface EnvConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
}

const ENV: EnvConfig = {
  API_BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.example.com',
  APP_ENV: (Constants.expoConfig?.extra?.appEnv as EnvConfig['APP_ENV']) || 'development',
};

export const { API_BASE_URL, APP_ENV } = ENV;
export const IS_DEV = APP_ENV === 'development';
export const IS_PROD = APP_ENV === 'production';
