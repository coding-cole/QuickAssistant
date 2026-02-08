import Constants from 'expo-constants';

interface EnvConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  GROQ_API_KEY: string;
  TRIP_ESTIMATION_URL: string;
  TRIP_ESTIMATION_TOKEN: string;
  TRIP_ESTIMATION_MOCK_ENABLED: boolean;
}

const ENV: EnvConfig = {
  API_BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.example.com',
  APP_ENV: (Constants.expoConfig?.extra?.appEnv as EnvConfig['APP_ENV']) || 'development',
  GROQ_API_KEY: Constants.expoConfig?.extra?.groqApiKey || '',
  TRIP_ESTIMATION_URL:
    Constants.expoConfig?.extra?.tripEstimationUrl ||
    'https://quantitative-extraordinary-permanent-choose.trycloudflare.com/process/sendTrip',
  TRIP_ESTIMATION_TOKEN: Constants.expoConfig?.extra?.tripEstimationToken || '',
  TRIP_ESTIMATION_MOCK_ENABLED:
    Boolean(Constants.expoConfig?.extra?.tripEstimationMockEnabled) || false,
};

export const {
  API_BASE_URL,
  APP_ENV,
  GROQ_API_KEY,
  TRIP_ESTIMATION_URL,
  TRIP_ESTIMATION_TOKEN,
  TRIP_ESTIMATION_MOCK_ENABLED,
} = ENV;
export const IS_DEV = APP_ENV === 'development';
export const IS_PROD = APP_ENV === 'production';
