import { Platform } from 'react-native';
import { baseApi } from '@api/baseApi';
import { TRIP_ESTIMATION_TOKEN, IS_DEV } from '@config/env';
import { TRIP_ESTIMATION_MOCK_ENABLED, TRIP_ESTIMATION_URL } from '@/globals';

export interface TripEstimationRequestPayload {
  messageToAI: string;
  origin?: string;
  destination?: string;
}

export interface TripEstimationResponse {
  code?: number;
  httpStatus?: number;
  message?: string;
  voiceMessage?: string;
  dataType?: string | null;
  data?: unknown;
  preListMessage?: string | null;
  postListMessage?: string | null;
  preListData?: unknown;
  postListData?: unknown;
  postListDataType?: string | null;
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

const MOCK_TRIP_ESTIMATION_RESPONSE: TripEstimationResponse = {
  code: 0,
  httpStatus: 200,
  message:
    'Here’s the comparison for your trip:\n\n**Route:**  \n84 Ozumba Mbadiwe Avenue, Victoria Island, Lagos → 14 Bexley Court, Dauda Fasanya Street, Ikate Elegushi, Lagos  \n**Currency:** NGN (₦)\n\n---\n\n### Uber options\n- **UberX**\n  - Price: **₦4,200** (promo applied; original **₦5,000**)\n  - ETA: **5 min**\n  - Seats: **4**\n\n- **Select**\n  - Price: **₦6,700**\n  - ETA: **6 min**\n  - Seats: **4**\n  - Note: More comfortable cars\n\n**Cheapest on Uber:** **UberX – ₦4,200** (with 20% promo)\n\n---\n\n### Bolt options\n- **Basic** (marked “cheapest”)\n  - Price: **₦4,600**\n  - ETA: **3 min**\n  - Seats: **3**\n\n- **Bolt**\n  - Price: **₦5,200**\n  - ETA: **8 min**\n  - Seats: **4**\n\n- **Comfort**\n  - Price: **₦5,400**\n  - ETA: **9 min**\n  - Seats: **4**\n\n- **Send Motorbike** (delivery, not passenger)\n  - Price: **₦2,500**\n  - ETA: **5 min**\n  - Seats: **0** (for parcels, not riders)\n\n**Cheapest passenger option on Bolt:** **Basic – ₦4,600**\n\n---\n\n### Which is cheaper for you?\n\n- **Cheapest standard car overall:**  \n  **UberX at ₦4,200** vs **Bolt Basic at ₦4,600** → **Uber is about ₦400 cheaper** right now (mainly due to the 20% promotion).\n\n- If you must have **4 seats**, compare:\n  - **UberX (4 seats): ₦4,200**\n  - **Bolt (4 seats, standard “Bolt”): ₦5,200**  \n  Uber remains cheaper by about **₦1,000**.\n\nNote: Actual prices can change with surge, traffic, and time; refresh the apps before booking.',
  voiceMessage:
    'UberX is currently the cheapest suitable option at ₦4,200 with 4 seats and a 5-minute arrival, beating Bolt’s closest options by ₦400 to ₦1,000.',
  dataType: null,
  data: null,
  preListMessage:
    'Here’s the comparison for your trip:\n\n**Route:**  \n84 Ozumba Mbadiwe Avenue, Victoria Island, Lagos → 14 Bexley Court, Dauda Fasanya Street, Ikate Elegushi, Lagos  \n**Currency:** NGN (₦)\n\n---\n\n### Uber options\n- **UberX**\n  - Price: **₦4,200** (promo applied; original **₦5,000**)\n  - ETA: **5 min**\n  - Seats: **4**\n\n- **Select**\n  - Price: **₦6,700**\n  - ETA: **6 min**\n  - Seats: **4**\n  - Note: More comfortable cars\n\n**Cheapest on Uber:** **UberX – ₦4,200** (with 20% promo)\n\n---\n\n### Bolt options\n- **Basic** (marked “cheapest”)\n  - Price: **₦4,600**\n  - ETA: **3 min**\n  - Seats: **3**\n\n- **Bolt**\n  - Price: **₦5,200**\n  - ETA: **8 min**\n  - Seats: **4**\n\n- **Comfort**\n  - Price: **₦5,400**\n  - ETA: **9 min**\n  - Seats: **4**\n\n- **Send Motorbike** (delivery, not passenger)\n  - Price: **₦2,500**\n  - ETA: **5 min**\n  - Seats: **0** (for parcels, not riders)\n\n**Cheapest passenger option on Bolt:** **Basic – ₦4,600**\n\n---\n\n### Which is cheaper for you?\n\n- **Cheapest standard car overall:**  \n  **UberX at ₦4,200** vs **Bolt Basic at ₦4,600** → **Uber is about ₦400 cheaper** right now (mainly due to the 20% promotion).\n\n- If you must have **4 seats**, compare:\n  - **UberX (4 seats): ₦4,200**\n  - **Bolt (4 seats, standard “Bolt”): ₦5,200**  \n  Uber remains cheaper by about **₦1,000**.\n\nNote: Actual prices can change with surge, traffic, and time; refresh the apps before booking.',
  postListMessage: null,
  postListDataType: null,
  postListData: null,
};

// CORS proxy only needed for web (mobile has no CORS restrictions)
const PROXY_URL = 'http://192.168.1.168:3001';

const getApiUrl = (): string => {
  if (IS_DEV && Platform.OS === 'web') {
    return `${PROXY_URL}?url=${encodeURIComponent(TRIP_ESTIMATION_URL)}`;
  }
  return TRIP_ESTIMATION_URL;
};

// RTK Query endpoint
export const tripEstimationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendTrip: builder.mutation<TripEstimationResponse, TripEstimationRequestPayload>({
      queryFn: async ({ messageToAI, origin = '', destination = '' }, _api, _extra, baseQuery) => {
        if (TRIP_ESTIMATION_MOCK_ENABLED) {
          console.warn('[TripEstimationAPI] Mock enabled - returning mock response.');
          return { data: MOCK_TRIP_ESTIMATION_RESPONSE };
        }

        const result = await baseQuery({
          url: TRIP_ESTIMATION_URL,
          method: 'POST',
          body: { messageToAI },
          headers: {
            ...TRIP_HEADERS,
            origin,
            destination,
          },
        });

        return result as { data: TripEstimationResponse };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useSendTripMutation } = tripEstimationApi;

const buildTripFailureMessage = (status: number): string =>
  `Trip estimation failed (${status}). Please try again.`;

// Standalone function for non-React contexts (class-based services)
export async function sendTripEstimation(
  payload: TripEstimationRequestPayload
): Promise<TripEstimationResponse> {
  const { messageToAI, origin = '', destination = '' } = payload;

  if (TRIP_ESTIMATION_MOCK_ENABLED) {
    console.warn('[TripEstimationAPI] Mock enabled - returning mock response.');
    return MOCK_TRIP_ESTIMATION_RESPONSE;
  }

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
      let errorMessage = errorText;

      try {
        const parsed = JSON.parse(errorText) as Partial<TripEstimationResponse>;
        errorMessage = parsed.message || errorMessage;
      } catch {
        // keep raw error text
      }

      const fallbackMessage = buildTripFailureMessage(response.status);
      console.error('[TripEstimationAPI] Error response:', errorMessage);
      return {
        code: response.status,
        httpStatus: response.status,
        message: errorMessage || fallbackMessage,
      };
    }

    const data = await response.json();
    console.warn('[TripEstimationAPI] Response data:', data);
    return {
      ...data,
      httpStatus: response.status,
    };
  } catch (error) {
    console.error('[TripEstimationAPI] Fetch error:', error);
    return {
      code: -1,
      httpStatus: -1,
      message:
        error instanceof Error
          ? `Trip estimation request failed (-1): ${error.message}`
          : buildTripFailureMessage(-1),
    };
  }
}
