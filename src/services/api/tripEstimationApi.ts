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
import { TRIP_ESTIMATION_BASE_URL_DEFAULT, TRIP_ESTIMATION_PATH } from '@/config';
import { storageService } from '@services/storage';

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
 * Uses no baseUrl (full URL is built at call time) and applies its own headers
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

export const tripEstimationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendTrip: builder.mutation<TripEstimationResponse, TripEstimationRequestPayload>({
      queryFn: async ({ messageToAI, origin = '', destination = '' }, api) => {
        const savedBaseUrl = await storageService.getEstimationBaseUrl();
        const baseUrl = savedBaseUrl?.trim() || TRIP_ESTIMATION_BASE_URL_DEFAULT;
        const fullUrl = `${baseUrl}${TRIP_ESTIMATION_PATH}`;

        const extraHeaders: Record<string, string> = {};
        if (origin) extraHeaders['origin'] = origin;
        if (destination) extraHeaders['destination'] = destination;

        console.log('[Trip API Request]', {
          url: fullUrl,
          method: 'POST',
          headers: { ...TRIP_HEADERS, ...extraHeaders },
          body: { messageToAI },
        });

        const result = await tripBaseQuery(
          {
            url: fullUrl,
            method: 'POST',
            body: { messageToAI },
            headers: extraHeaders,
          },
          api,
          {}
        );

        if (result.error) {
          console.log('[Trip API Response Error]', {
            status: result.meta?.response?.status,
            error: result.error,
          });
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

        console.log('[Trip API Response]', {
          status: result.meta?.response?.status,
          data: result.data,
        });

        return { data: result.data as TripEstimationResponse };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useSendTripMutation } = tripEstimationApi;
