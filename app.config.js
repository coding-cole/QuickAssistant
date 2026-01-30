import 'dotenv/config';

export default {
  expo: {
    name: 'QuickAssistant',
    slug: 'QuickAssistant',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
      appEnv: process.env.APP_ENV || 'development',
      groqApiKey: process.env.GROQ_API_KEY || '',
      tripEstimationUrl:
        process.env.TRIP_ESTIMATION_URL ||
        'https://quantitative-extraordinary-permanent-choose.trycloudflare.com/process/sendTrip',
      tripEstimationToken: process.env.TRIP_ESTIMATION_TOKEN || '',
    },
  },
};
