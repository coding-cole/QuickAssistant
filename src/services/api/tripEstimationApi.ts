/**
 * Trip Estimation API — RTK Query only.
 * IMPORTANT: Never use raw `fetch` in this project. All HTTP calls must go through RTK Query.
 *
 * NOTE: This endpoint uses its own fetchBaseQuery (tripBaseQuery) instead of the shared
 * baseQuery from baseApi. This is because the trip estimation API requires its own
 * Authorization token and custom headers — the shared baseQuery would overwrite them
 * with the user's auth token.
 */
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from '@api/baseApi';
import { TRIP_ESTIMATION_TOKEN } from '@config/env';
import { TRIP_ESTIMATION_MOCK_ENABLED, TRIP_ESTIMATION_URL } from '@/config';

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

/**
 * Dedicated base query for the trip estimation API.
 * Uses no baseUrl (TRIP_ESTIMATION_URL is a full URL) and applies its own headers
 * so the shared baseApi prepareHeaders doesn't overwrite Authorization.
 */
const tripBaseQuery = fetchBaseQuery({
  prepareHeaders: (headers) => {
    Object.entries(TRIP_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return headers;
  },
});

const MOCK_TRIP_ESTIMATION_RESPONSE: TripEstimationResponse = {
  code: 0,
  httpStatus: 200,
  message:
    "Here's the comparison for your trip:\n\n**Route:**  \n84 Ozumba Mbadiwe Avenue, Victoria Island, Lagos \u2192 14 Bexley Court, Dauda Fasanya Street, Ikate Elegushi, Lagos  \n**Currency:** NGN (\u20A6)\n\n---\n\n### Uber options\n- **UberX**\n  - Price: **\u20A64,200** (promo applied; original **\u20A65,000**)\n  - ETA: **5 min**\n  - Seats: **4**\n\n- **Select**\n  - Price: **\u20A66,700**\n  - ETA: **6 min**\n  - Seats: **4**\n  - Note: More comfortable cars\n\n**Cheapest on Uber:** **UberX \u2013 \u20A64,200** (with 20% promo)\n\n---\n\n### Bolt options\n- **Basic** (marked \u201ccheapest\u201d)\n  - Price: **\u20A64,600**\n  - ETA: **3 min**\n  - Seats: **3**\n\n- **Bolt**\n  - Price: **\u20A65,200**\n  - ETA: **8 min**\n  - Seats: **4**\n\n- **Comfort**\n  - Price: **\u20A65,400**\n  - ETA: **9 min**\n  - Seats: **4**\n\n- **Send Motorbike** (delivery, not passenger)\n  - Price: **\u20A62,500**\n  - ETA: **5 min**\n  - Seats: **0** (for parcels, not riders)\n\n**Cheapest passenger option on Bolt:** **Basic \u2013 \u20A64,600**",
  voiceMessage:
    'UberX is currently the cheapest suitable option at \u20A64,200 with 4 seats and a 5-minute arrival.',
  dataType: null,
  data: null,
  preListMessage: null,
  postListMessage: null,
  postListDataType: null,
  postListData: null,
};

export const tripEstimationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendTrip: builder.mutation<TripEstimationResponse, TripEstimationRequestPayload>({
      queryFn: async ({ messageToAI, origin = '', destination = '' }, api) => {
        if (TRIP_ESTIMATION_MOCK_ENABLED) {
          console.warn('[TripEstimationAPI] Mock enabled - returning mock response.');
          return { data: MOCK_TRIP_ESTIMATION_RESPONSE };
        }

        const headers: Record<string, string> = {};
        if (origin) headers['origin'] = origin;
        if (destination) headers['destination'] = destination;

        const result = await tripBaseQuery(
          {
            url: TRIP_ESTIMATION_URL,
            method: 'POST',
            body: { messageToAI },
            headers,
          },
          api,
          {}
        );

        if (result.error) {
          return {
            data: {
              code: typeof result.error.status === 'number' ? result.error.status : -1,
              httpStatus: typeof result.error.status === 'number' ? result.error.status : -1,
              message:
                (result.error.data as { message?: string })?.message ||
                'Trip estimation request failed.',
            },
          };
        }

        return { data: result.data as TripEstimationResponse };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useSendTripMutation } = tripEstimationApi;
