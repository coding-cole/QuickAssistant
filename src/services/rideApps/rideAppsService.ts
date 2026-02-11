import { Alert, Linking, Platform } from 'react-native';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationWithAddress extends Coordinates {
  nickname?: string;
  formattedAddress?: string;
}

export interface RideAppParams {
  pickup?: Coordinates;
  dropoff?: LocationWithAddress;
}

export type RideAppProvider = 'uber' | 'bolt';

interface RideAppConfig {
  name: string;
  urlScheme: string;
  androidPackage: string;
  appStoreUrl: string;
  playStoreUrl: string;
  buildDeepLink: (params?: RideAppParams) => string;
  buildUniversalLink?: (params?: RideAppParams) => string;
}

// ── Deep Link Builders ─────────────────────────────────────────────────────────

const hasValidCoordinates = (coords: Coordinates): boolean =>
  coords.latitude !== 0 || coords.longitude !== 0;

const buildUberDeepLink = (params?: RideAppParams): string => {
  if (!params?.pickup && !params?.dropoff) return 'uber://';

  const parts: string[] = ['action=setPickup'];

  if (params.pickup && hasValidCoordinates(params.pickup)) {
    parts.push(
      `pickup[latitude]=${params.pickup.latitude}`,
      `pickup[longitude]=${params.pickup.longitude}`
    );
  } else {
    parts.push('pickup=my_location');
  }

  if (params.dropoff) {
    if (hasValidCoordinates(params.dropoff)) {
      parts.push(
        `dropoff[latitude]=${params.dropoff.latitude}`,
        `dropoff[longitude]=${params.dropoff.longitude}`
      );
    }
    if (params.dropoff.nickname) {
      parts.push(`dropoff[nickname]=${encodeURIComponent(params.dropoff.nickname)}`);
    }
    if (params.dropoff.formattedAddress) {
      parts.push(
        `dropoff[formatted_address]=${encodeURIComponent(params.dropoff.formattedAddress)}`
      );
    }
    if (!params.dropoff.nickname && !params.dropoff.formattedAddress) {
      parts.push(`dropoff[nickname]=${encodeURIComponent('Destination')}`);
    }
  }

  return `uber://?${parts.join('&')}`;
};

const buildUberUniversalLink = (params?: RideAppParams): string => {
  if (!params?.dropoff) return 'https://m.uber.com/ul/';

  const parts: string[] = [];

  if (params.pickup && hasValidCoordinates(params.pickup)) {
    parts.push(
      `pickup[latitude]=${params.pickup.latitude}`,
      `pickup[longitude]=${params.pickup.longitude}`
    );
  }

  if (hasValidCoordinates(params.dropoff)) {
    parts.push(
      `dropoff[latitude]=${params.dropoff.latitude}`,
      `dropoff[longitude]=${params.dropoff.longitude}`
    );
  }

  const nickname = params.dropoff.nickname || params.dropoff.formattedAddress || 'Destination';
  parts.push(`dropoff[nickname]=${encodeURIComponent(nickname)}`);

  if (params.dropoff.formattedAddress) {
    parts.push(`dropoff[formatted_address]=${encodeURIComponent(params.dropoff.formattedAddress)}`);
  }

  return `https://m.uber.com/ul/?action=setPickup&${parts.join('&')}`;
};

const buildBoltDeepLink = (): string => {
  // Bolt has no documented public deep link API.
  // The only reliable behavior is opening the app itself.
  return 'bolt://';
};

// ── App Configurations ─────────────────────────────────────────────────────────

const RIDE_APP_CONFIGS: Record<RideAppProvider, RideAppConfig> = {
  uber: {
    name: 'Uber',
    urlScheme: 'uber://',
    androidPackage: 'com.ubercab',
    appStoreUrl: 'https://apps.apple.com/app/uber/id368677368',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
    buildDeepLink: buildUberDeepLink,
    buildUniversalLink: buildUberUniversalLink,
  },
  bolt: {
    name: 'Bolt',
    urlScheme: 'bolt://',
    androidPackage: 'ee.mtakso.client',
    appStoreUrl: 'https://apps.apple.com/app/bolt-request-a-ride/id675033630',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=ee.mtakso.client',
    buildDeepLink: buildBoltDeepLink,
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const getStoreUrl = (config: RideAppConfig): string => {
  return Platform.select({
    ios: config.appStoreUrl,
    default: config.playStoreUrl,
  });
};

const openStore = async (config: RideAppConfig): Promise<void> => {
  const storeUrl = getStoreUrl(config);
  const canOpen = await Linking.canOpenURL(storeUrl);
  if (canOpen) {
    await Linking.openURL(storeUrl);
  } else {
    Alert.alert('Error', `Unable to open the app store for ${config.name}.`);
  }
};

// ── Service ────────────────────────────────────────────────────────────────────

export const rideAppsService = {
  /**
   * Check whether a ride app is installed on the device.
   */
  isAppInstalled: async (provider: RideAppProvider): Promise<boolean> => {
    const config = RIDE_APP_CONFIGS[provider];
    try {
      return await Linking.canOpenURL(config.urlScheme);
    } catch {
      return false;
    }
  },

  /**
   * Open a ride app with optional pickup/dropoff coordinates.
   *
   * Fallback strategy:
   * - Uber: tries native deep link → universal link (web) → app store
   * - Bolt: tries native deep link → app store
   */
  openApp: async (provider: RideAppProvider, params?: RideAppParams): Promise<void> => {
    const config = RIDE_APP_CONFIGS[provider];

    try {
      const isInstalled = await Linking.canOpenURL(config.urlScheme);

      if (isInstalled) {
        const deepLink = config.buildDeepLink(params);
        await Linking.openURL(deepLink);
        return;
      }

      // Fallback: try universal link if available (Uber web booking)
      if (config.buildUniversalLink) {
        const universalLink = config.buildUniversalLink(params);
        const canOpenUniversal = await Linking.canOpenURL(universalLink);
        if (canOpenUniversal) {
          Alert.alert(
            `${config.name} Not Installed`,
            `Open ${config.name} in your browser, or download the app?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open in Browser', onPress: () => Linking.openURL(universalLink) },
              { text: 'Download App', onPress: () => openStore(config) },
            ]
          );
          return;
        }
      }

      // Final fallback: app store
      Alert.alert(
        `${config.name} Not Installed`,
        `${config.name} is not installed on your device. Would you like to download it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => openStore(config) },
        ]
      );
    } catch (error) {
      console.error(`Error opening ${config.name}:`, error);
      Alert.alert(
        'Error',
        `Something went wrong while trying to open ${config.name}. Please try again.`
      );
    }
  },

  /**
   * Redirect to the app store page for a ride app.
   */
  openAppStore: async (provider: RideAppProvider): Promise<void> => {
    const config = RIDE_APP_CONFIGS[provider];
    try {
      await openStore(config);
    } catch (error) {
      console.error(`Error opening store for ${config.name}:`, error);
      Alert.alert('Error', 'Unable to open the app store. Please try again.');
    }
  },
};
