import { TransportOption } from '@components/common';

// Provider brand colors
const PROVIDER_COLORS: Record<string, string> = {
  bolt: '#34D186',
  uber: '#000000',
  indrive: '#FF6B00',
  taxify: '#34D186',
  lyft: '#FF00BF',
};

// Generate avatar URL for provider logo
const getProviderLogo = (name: string, color: string) => ({
  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color.replace('#', '')}&color=fff&size=96`,
});

// Get provider color (fallback to gray)
const getProviderColor = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  return PROVIDER_COLORS[normalized] || '#666666';
};

const normalizeProviderName = (name: string): string => {
  return name.replace(/\s+options$/i, '').trim();
};

// Parse price from string like "₦18,600" or "₦18,600–21,300" or "NGN 21,100"
const parsePrice = (priceStr: string): number | null => {
  const normalized = priceStr.replace(/,/g, '');
  const match = normalized.match(/(?:₦|ngn)\s*([\d.]+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

// Parse ETA from string like "3 min" or "5 mins"
const parseETA = (etaStr: string): number | null => {
  const match = etaStr.match(/(\d+)\s*min/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

const parseSeats = (seatsStr: string): number | null => {
  const normalized = seatsStr.toLowerCase();

  if (normalized.includes('seat')) {
    const match = normalized.match(/(\d+)\s*seats?/i);
    return match ? parseInt(match[1], 10) : null;
  }

  if (/^\s*\d+\s*$/.test(normalized)) {
    const match = normalized.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  return null;
};

interface ParsedOption {
  providerName: string;
  optionName: string;
  price: number;
  eta: number;
  seats?: number;
}

// Parse a single bullet line
// Examples:
// - **Bolt (standard)**: **₦18,600** — ETA ~ **3 min**, 4 seats
// - **Comfort**: **₦21,300** — 4 seats, ~3 min ETA
const parseBulletLine = (line: string, currentProvider: string): ParsedOption | null => {
  const bulletMatch = line.match(/^-\s*\*\*(.+?)\*\*:\s*\*\*(.+?)\*\*/i);
  if (!bulletMatch) return null;

  const optionName = bulletMatch[1].trim();
  const priceStr = bulletMatch[2];
  const price = parsePrice(priceStr);
  if (price === null) return null;

  const etaMatch = line.match(/(~?\s*\d+\s*min)/i);
  const eta = etaMatch ? parseETA(etaMatch[1]) : null;
  const seats = parseSeats(line) ?? undefined;

  return {
    providerName: currentProvider,
    optionName,
    price,
    eta: eta ?? 15,
    seats,
  };
};

// Main parser function
export function parseTransportOptions(message: string): TransportOption[] {
  const options: TransportOption[] = [];
  const lines = message.split('\n');

  let currentProvider = '';
  let currentOptionName = '';
  let pendingPrice: number | null = null;
  let pendingEta: number | null = null;
  let pendingSeats: number | null = null;

  const pushPendingOption = () => {
    if (currentProvider && pendingPrice !== null) {
      const color = getProviderColor(currentProvider);
      const displayName = currentOptionName
        ? `${currentProvider} ${currentOptionName}`
        : currentProvider;

      options.push({
        provider: {
          name: displayName,
          logo: getProviderLogo(currentProvider, color),
          color,
        },
        price: pendingPrice,
        eta: pendingEta ?? 15,
        seats: pendingSeats ?? 0,
        badge: null,
      });
    }

    currentOptionName = '';
    pendingPrice = null;
    pendingEta = null;
    pendingSeats = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for provider header (### Bolt, ### Uber)
    const headerMatch = trimmed.match(/^###\s*(.+)/);
    if (headerMatch) {
      pushPendingOption();
      currentProvider = normalizeProviderName(headerMatch[1].trim());
      continue;
    }

    // Check for provider header (**Uber**, **Bolt**)
    const boldHeaderMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
    if (boldHeaderMatch) {
      pushPendingOption();
      currentProvider = normalizeProviderName(boldHeaderMatch[1].trim());
      continue;
    }

    // Check for provider header in sentence (e.g., "From **Bolt** estimates")
    const inlineProviderMatch = trimmed.match(/\*\*(.+?)\*\*\s+estimates?/i);
    if (inlineProviderMatch) {
      pushPendingOption();
      currentProvider = inlineProviderMatch[1].trim();
      continue;
    }

    // Check for bullet point with ride option
    if (trimmed.startsWith('-') && currentProvider) {
      const optionHeaderMatch = trimmed.match(/^-\s*\*\*(.+?)\*\*(?!:)/i);
      if (optionHeaderMatch) {
        pushPendingOption();
        currentOptionName = optionHeaderMatch[1].trim();
        continue;
      }

      const parsed = parseBulletLine(trimmed, currentProvider);

      if (parsed) {
        const color = getProviderColor(parsed.providerName);
        const displayName = parsed.optionName.includes(parsed.providerName)
          ? parsed.optionName
          : `${parsed.providerName} ${parsed.optionName}`;

        options.push({
          provider: {
            name: displayName,
            logo: getProviderLogo(parsed.providerName, color),
            color,
          },
          price: parsed.price,
          eta: parsed.eta,
          seats: parsed.seats ?? 0,
          badge: null,
        });
        continue;
      }

      // Parse multi-line entries (Type/Price/ETA)
      const typeMatch = trimmed.match(/^-\s*Type:\s*\*\*(.+?)\*\*/i);
      if (typeMatch) {
        currentOptionName = typeMatch[1].trim();
        continue;
      }

      const priceMatch = trimmed.match(/^-\s*Price:\s*\*\*(.+?)\*\*/i);
      if (priceMatch) {
        pendingPrice = parsePrice(priceMatch[1]);
        continue;
      }

      const etaMatch = trimmed.match(/^-\s*ETA:\s*\*\*(.+?)\*\*/i);
      if (etaMatch) {
        pendingEta = parseETA(etaMatch[1]);
      }

      const seatsMatch = trimmed.match(/^-\s*Seats?:\s*\*\*(.+?)\*\*/i);
      if (seatsMatch) {
        pendingSeats = parseSeats(seatsMatch[1]);
        continue;
      }

      // Parse dash-separated format: - **Bolt Basic** – **₦3,900** (ETA ~12 min, ...)
      const dashMatch = trimmed.match(/^-\s*\*\*(.+?)\*\*\s*[–-]\s*\*\*(.+?)\*\*/i);
      if (dashMatch) {
        const optionName = dashMatch[1].trim();
        const price = parsePrice(dashMatch[2]);
        if (price !== null) {
          const etaMatchInline = trimmed.match(/ETA\s*~?\s*(\d+\s*min)/i);
          const eta = etaMatchInline ? (parseETA(etaMatchInline[1]) ?? 15) : 15;
          const seats = parseSeats(trimmed) ?? 0;
          const color = getProviderColor(currentProvider);
          const displayName = optionName.includes(currentProvider)
            ? optionName
            : `${currentProvider} ${optionName}`;

          options.push({
            provider: {
              name: displayName,
              logo: getProviderLogo(currentProvider, color),
              color,
            },
            price,
            eta,
            seats,
            badge: null,
          });
        }
      }
    }
  }

  pushPendingOption();

  // Add badges based on price/eta
  if (options.length > 0) {
    // Find cheapest
    const cheapestIdx = options.reduce(
      (minIdx, opt, idx, arr) => (opt.price < arr[minIdx].price ? idx : minIdx),
      0
    );

    // Find fastest
    const fastestIdx = options.reduce(
      (minIdx, opt, idx, arr) => (opt.eta < arr[minIdx].eta ? idx : minIdx),
      0
    );

    // Assign badges (cheapest takes priority if same option is both)
    if (cheapestIdx === fastestIdx) {
      options[cheapestIdx].badge = 'recommended';
    } else {
      options[cheapestIdx].badge = 'cheapest';
      options[fastestIdx].badge = 'fastest';
    }
  }

  return options;
}
