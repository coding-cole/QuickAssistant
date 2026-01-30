import { baseApi } from '@api/baseApi';
import { TRIP_ESTIMATION_URL, TRIP_ESTIMATION_TOKEN, IS_DEV } from '@config/env';

export interface TripEstimationRequestPayload {
  messageToAI: string;
  origin?: string;
  destination?: string;
}

export interface TripEstimationResponse {
  code?: number;
  message?: string;
  voiceMessage?: string;
  dataType?: string | null;
  data?: unknown;
  preListMessage?: string | null;
  postListMessage?: string | null;
  preListData?: unknown;
  postListData?: unknown;
}

const TRIP_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${TRIP_ESTIMATION_TOKEN}`,
  'User-Id': 'PASSWORD:1327390847:gQzbRLTp61ONzDFwb0loyw==',
  'Device-Id': 'f2e7260f5ff01276',
  'Device-Type': 'mobile',
  'Device-Info': 'QuickAssistant',
  aiSessionId:
    'djkD0xMOSgjpDgSmB1ISDyC6ySUS1eTPkUm9/GjPSZs=-1-bd7bf577-7a72-4b85-b8ad-cfbfcfd1800b',
};

// CORS proxy for development (run: node proxy-server.js)
// Use your Mac's IP address for iOS simulator access
const PROXY_URL = 'http://192.168.1.168:3001';

// Get the URL to use (proxy in dev, direct in prod)
const getApiUrl = (): string => {
  if (IS_DEV) {
    return `${PROXY_URL}?url=${encodeURIComponent(TRIP_ESTIMATION_URL)}`;
  }
  return TRIP_ESTIMATION_URL;
};

// RTK Query endpoint
export const tripEstimationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendTrip: builder.mutation<TripEstimationResponse, TripEstimationRequestPayload>({
      query: ({ messageToAI, origin = '', destination = '' }) => ({
        url: TRIP_ESTIMATION_URL,
        method: 'POST',
        body: { messageToAI },
        headers: {
          ...TRIP_HEADERS,
          origin,
          destination,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendTripMutation } = tripEstimationApi;

// Standalone function for non-React contexts (class-based services)
export async function sendTripEstimation(
  payload: TripEstimationRequestPayload
): Promise<TripEstimationResponse> {
  const { messageToAI, origin = '', destination = '' } = payload;

  const apiUrl = getApiUrl();
  console.warn('[TripEstimationAPI] URL:', apiUrl);
  console.warn('[TripEstimationAPI] Payload:', { messageToAI });

  try {
    // Build headers, only add origin/destination if they have values
    const headers: Record<string, string> = { ...TRIP_HEADERS };
    if (origin) headers['origin'] = origin;
    if (destination) headers['destination'] = destination;

    // eslint-disable-next-line no-undef
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messageToAI }),
    });

    console.warn('[TripEstimationAPI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TripEstimationAPI] Error response:', errorText);
      throw new Error(`Trip estimation failed: ${response.status}`);
    }

    const data = await response.json();
    console.warn('[TripEstimationAPI] Response data:', data);
    return data;
  } catch (error) {
    console.error('[TripEstimationAPI] Fetch error:', error);
    throw error;
  }
}
