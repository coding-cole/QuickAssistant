/**
 * Trip Estimation Service — Orchestrates RTK Query API call + Groq extraction.
 * This is the main service consumed by ChatScreen.
 */
import { TransportOption } from '@components/common';
import { tripEstimationApi } from '@services/api/tripEstimationApi';
import { extractTransportOptions } from './groqService';

export interface AIResponse {
  success: boolean;
  message: string;
  error?: string;
  metadata?: {
    hasTransportOptions?: boolean;
    transportOptions?: TransportOption[];
    summary?: string;
    origin?: string;
    destination?: string;
  };
}

class TripEstimationService {
  async sendMessage(message: string): Promise<AIResponse> {
    try {
      // Lazy import to avoid circular dependency (store imports slices → baseApi → this file)
      const { store } = require('@state/store');

      // Call the trip estimation API via RTK Query
      const result = await store
        .dispatch(tripEstimationApi.endpoints.sendTrip.initiate({ messageToAI: message }))
        .unwrap();

      if (typeof result.httpStatus === 'number' && result.httpStatus !== 200) {
        return {
          success: false,
          message: `Trip estimation failed (${result.httpStatus}). Please try again.`,
          error: result.message || `Trip estimation error (${result.httpStatus})`,
        };
      }

      const responseMessage = result.message || 'No response received';

      // Use Groq to extract structured transport options
      const extracted = await extractTransportOptions(responseMessage);

      if (extracted && extracted.transportOptions.length > 0) {
        return {
          success: true,
          message: responseMessage,
          metadata: {
            hasTransportOptions: true,
            transportOptions: extracted.transportOptions,
            summary: extracted.summary,
            origin: extracted.origin,
            destination: extracted.destination,
          },
        };
      }

      return {
        success: true,
        message: responseMessage,
      };
    } catch (error) {
      console.error('[TripEstimationService] Error:', error);
      return {
        success: false,
        message: 'Failed to get response. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const tripEstimationService = new TripEstimationService();
