import { TransportOption } from '@components/common';
import { sendTripEstimation, TripEstimationResponse } from '@services/api/tripEstimationApi';
import { parseTransportOptions } from '@utils/parseTransportOptions';

// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ActionButton {
  id: string;
  label: string;
  action: 'navigate' | 'book_ride' | 'show_calendar' | 'search';
  params?: Record<string, any>;
}

export interface AIResponse {
  success: boolean;
  message: string;
  error?: string;
  // Hidden JSON metadata for UI (not displayed to user)
  metadata?: {
    hasTransportOptions?: boolean;
    transportOptions?: TransportOption[];
    origin?: string;
    destination?: string;
    hasActions?: boolean;
    actions?: ActionButton[];
    eventSuggestions?: string[];
  };
}

// Trip Estimation Service
class TripEstimationService {
  // Send a message and get a response from the trip estimation API
  async sendMessage(message: string): Promise<AIResponse> {
    try {
      const response: TripEstimationResponse = await sendTripEstimation({
        messageToAI: message,
      });

      if (typeof response.httpStatus === 'number' && response.httpStatus !== 200) {
        const fallbackMessage = `Trip estimation failed (${response.httpStatus}). Please try again.`;
        return {
          success: false,
          message: fallbackMessage,
          error: response.message || `Trip estimation error (${response.httpStatus})`,
        };
      }

      const responseMessage = response.message || 'No response received';

      // Parse transport options from the markdown response
      const transportOptions = parseTransportOptions(responseMessage);

      if (transportOptions.length > 0) {
        // Parse origin/destination from the "**Route:**" line in the markdown
        const routeMatch = responseMessage.match(
          /\*\*Route:\*\*\s*\n?\s*(.+?)\s*→\s*(.+?)(?:\s*\n|$)/
        );

        return {
          success: true,
          message: responseMessage,
          metadata: {
            hasTransportOptions: true,
            transportOptions,
            origin: routeMatch?.[1]?.trim(),
            destination: routeMatch?.[2]?.trim(),
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

  // Reset the chat session (no-op for stateless API)
  resetChat(): void {
    // No-op - trip estimation API is stateless
  }

  // Check if service is ready
  isReady(): boolean {
    return true;
  }

  // Get status for debugging
  getStatus(): { mode: 'api'; apiKeyConfigured: boolean } {
    return {
      mode: 'api',
      apiKeyConfigured: true,
    };
  }
}

// Export singleton instance (keeping the same export name for compatibility)
export const groqService = new TripEstimationService();
