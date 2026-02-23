/**
 * Groq AI Service — Pure extraction/AI logic only.
 * No HTTP calls to external APIs. This service only communicates with Groq.
 */
import Groq from 'groq-sdk';
import { TransportOption } from '@components/common';
import { GROQ_API_KEY } from '@config/env';
import { getProviderColor, getProviderLogo } from '@utils/parseTransportOptions';

interface ExtractedOption {
  provider: string;
  optionName: string;
  price: number | null;
  eta: number | null;
  seats: number | null;
}

interface ExtractedData {
  summary?: string;
  origin: string | null;
  destination: string | null;
  options: ExtractedOption[];
  reason?: string;
}

export interface GroqExtractionResult {
  transportOptions: TransportOption[];
  summary: string;
  origin: string;
  destination: string;
}

const groqClient = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

const EXTRACTION_PROMPT = `You are a strict data extractor. Extract ride/transport options from the text below and return ONLY valid JSON (no markdown, no code fences, no explanation).

CRITICAL RULES — DO NOT VIOLATE:
- ONLY extract data that is EXPLICITLY stated in the text. Do NOT invent, assume, or hallucinate any values.
- If a field (price, eta, seats) is NOT explicitly mentioned for an option, set it to null.
- If no ride/transport options are found in the text, return: {"options": [], "reason": "No transport options found in the response"}
- If the text is an error message or unrelated to ride options, return: {"options": [], "reason": "Response does not contain ride options"}
- Do NOT guess prices, ETAs, seat counts, provider names, or locations that are not in the text.
- Do NOT add options that are not in the text.

Return this exact structure:
{
  "summary": "A 2-3 sentence summary using ONLY facts from the text. Do not add information not present in the text.",
  "origin": "pickup location ONLY if explicitly stated in the text, otherwise null",
  "destination": "dropoff location ONLY if explicitly stated in the text, otherwise null",
  "options": [
    {
      "provider": "exact provider name from the text (e.g. Uber, Bolt)",
      "optionName": "exact ride type name from the text (e.g. UberX, Basic, Comfort)",
      "price": 5000,
      "eta": 4,
      "seats": 4
    }
  ]
}

Field rules:
- provider: Use the exact provider name from the text
- optionName: Use the exact option/ride type name from the text
- price: Number only (no currency symbols). Must be explicitly stated. If not found, set to null
- eta: Number in minutes. Must be explicitly stated. If not found, set to null
- seats: Number. Must be explicitly stated. If not found, set to null
- Exclude delivery-only options (like Send Motorbike) from the options array`;

function convertToTransportOptions(extracted: ExtractedData): TransportOption[] {
  const validOptions = extracted.options.filter((opt) => opt.price !== null);

  const options: TransportOption[] = validOptions.map((opt) => {
    const color = getProviderColor(opt.provider);
    const displayName = opt.optionName.toLowerCase().includes(opt.provider.toLowerCase())
      ? opt.optionName
      : `${opt.provider} ${opt.optionName}`;

    return {
      provider: {
        name: displayName,
        logo: getProviderLogo(opt.provider, color),
        color,
      },
      price: opt.price as number,
      eta: opt.eta ?? 0,
      seats: opt.seats ?? 0,
      badge: null,
    };
  });

  if (options.length > 0) {
    const cheapestIdx = options.reduce(
      (minIdx, opt, idx, arr) => (opt.price < arr[minIdx].price ? idx : minIdx),
      0
    );
    const fastestIdx = options.reduce(
      (minIdx, opt, idx, arr) => (opt.eta < arr[minIdx].eta ? idx : minIdx),
      0
    );

    if (cheapestIdx === fastestIdx) {
      options[cheapestIdx].badge = 'recommended';
    } else {
      options[cheapestIdx].badge = 'cheapest';
      options[fastestIdx].badge = 'fastest';
    }
  }

  return options;
}

export async function extractTransportOptions(
  markdown: string
): Promise<GroqExtractionResult | null> {
  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: markdown },
      ],
      temperature: 0,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) return null;

    const extracted: ExtractedData = JSON.parse(content);
    if (!extracted.options || extracted.options.length === 0) return null;

    const transportOptions = convertToTransportOptions(extracted);
    if (transportOptions.length === 0) return null;

    return {
      transportOptions,
      summary: extracted.summary || '',
      origin: extracted.origin || '',
      destination: extracted.destination || '',
    };
  } catch (error) {
    console.error('[GroqService] Extraction failed:', error);
    return null;
  }
}
