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
      infoPlist: {
        LSApplicationQueriesSchemes: ['uber', 'bolt'],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSAllowsLocalNetworking: true,
        },
      },
    },

    android: {
      package: "com.coding_cole.quickassistant",
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            queries: {
              package: ['com.ubercab', 'ee.mtakso.client'],
            },
          },
        },
      ],
    ],
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: "b1ef61db-cec3-4786-a9c9-cf7e61ccebfe"
      },
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
      appEnv: process.env.APP_ENV || 'development',
      groqApiKey: process.env.GROQ_API_KEY || '',
      tripEstimationToken: process.env.TRIP_ESTIMATION_TOKEN || '',
    },
  },
};
