/**
 * Mock Ride Estimation API
 * Simulates real ride provider API responses
 * Will be replaced with actual API integration later
 */

export interface RideEstimate {
  provider: {
    name: string;
    color: string;
    logo: { uri: string };
  };
  price: number;
  eta: number; // minutes
  badge?: 'recommended' | 'cheapest' | 'fastest';
  distance: number; // km
  surge?: number; // surge multiplier
}

export interface LocationData {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface RideEstimationResponse {
  success: boolean;
  origin: LocationData;
  destination: LocationData;
  estimates: RideEstimate[];
  note?: string;
}

export interface TrafficData {
  route: string;
  condition: 'light' | 'moderate' | 'heavy';
  delay: number; // minutes
  avgSpeed: number; // km/h
  timeOfDay: string;
}

export interface TrafficResponse {
  success: boolean;
  timestamp: Date;
  traffic: TrafficData[];
  recommendation?: string;
}

class MockRideAPI {
  /**
   * Mock locations database for Lagos
   */
  private locations = {
    'current location': { lat: 6.5244, lng: 3.3792 },
    lekki: { lat: 6.4265, lng: 3.5703 },
    vi: { lat: 6.4412, lng: 3.4705 },
    'victoria island': { lat: 6.4412, lng: 3.4705 },
    ikeja: { lat: 6.5833, lng: 3.3333 },
    ikoyi: { lat: 6.4614, lng: 3.4458 },
    surulere: { lat: 6.4948, lng: 3.3528 },
    yaba: { lat: 6.5117, lng: 3.3736 },
    mainland: { lat: 6.55, lng: 3.4 },
    island: { lat: 6.45, lng: 3.45 },
    airport: { lat: 6.5785, lng: 3.3213 },
    'murtala muhammed airport': { lat: 6.5785, lng: 3.3213 },
    'tech hub': { lat: 6.4412, lng: 3.4705 },
    grill: { lat: 6.4265, lng: 3.5703 },
    'fitness plus': { lat: 6.4614, lng: 3.4458 },
  };

  /**
   * Get ride estimates for a route
   */
  async getRideEstimates(origin: string, destination: string): Promise<RideEstimationResponse> {
    // Simulate API latency
    await this.delay(800);

    const originData = this.parseLocation(origin);
    const destData = this.parseLocation(destination);

    if (!originData || !destData) {
      return {
        success: false,
        origin: {
          address: origin,
          coordinates: { latitude: 0, longitude: 0 },
        },
        destination: {
          address: destination,
          coordinates: { latitude: 0, longitude: 0 },
        },
        estimates: [],
      };
    }

    // Calculate distance
    const distance = this.calculateDistance(
      originData.lat,
      originData.lng,
      destData.lat,
      destData.lng
    );

    // Generate estimates based on distance
    const estimates = this.generateEstimates(distance);

    return {
      success: true,
      origin: {
        address: origin,
        coordinates: {
          latitude: originData.lat,
          longitude: originData.lng,
        },
      },
      destination: {
        address: destination,
        coordinates: {
          latitude: destData.lat,
          longitude: destData.lng,
        },
      },
      estimates,
      note: `Distance: ${distance.toFixed(1)} km`,
    };
  }

  /**
   * Get traffic information for major routes
   */
  async getTrafficInfo(): Promise<TrafficResponse> {
    // Simulate API latency
    await this.delay(600);

    const now = new Date();
    const hour = now.getHours();

    // Mock traffic data based on time of day
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19);

    const traffic: TrafficData[] = [
      {
        route: 'Lekki-Epe Expressway',
        condition: isRushHour ? 'heavy' : 'moderate',
        delay: isRushHour ? 25 : 10,
        avgSpeed: isRushHour ? 15 : 30,
        timeOfDay: this.getTimeOfDay(hour),
      },
      {
        route: 'Third Mainland Bridge',
        condition: isRushHour ? 'heavy' : 'moderate',
        delay: isRushHour ? 20 : 8,
        avgSpeed: isRushHour ? 18 : 35,
        timeOfDay: this.getTimeOfDay(hour),
      },
      {
        route: 'Ikoyi Link Bridge',
        condition: 'light',
        delay: 2,
        avgSpeed: 50,
        timeOfDay: this.getTimeOfDay(hour),
      },
      {
        route: 'Lagos-Abeokuta Expressway',
        condition: isRushHour ? 'moderate' : 'light',
        delay: isRushHour ? 15 : 3,
        avgSpeed: isRushHour ? 25 : 55,
        timeOfDay: this.getTimeOfDay(hour),
      },
    ];

    return {
      success: true,
      timestamp: now,
      traffic,
      recommendation: isRushHour
        ? 'Rush hour detected. Consider using alternative routes or leaving later.'
        : 'Good time to travel. Light traffic expected.',
    };
  }

  /**
   * Parse location string to coordinates
   */
  private parseLocation(location: string): { lat: number; lng: number } | null {
    const normalized = location.toLowerCase().trim();

    // Check for exact match
    if (this.locations[normalized as keyof typeof this.locations]) {
      return this.locations[normalized as keyof typeof this.locations];
    }

    // Check for partial match
    for (const [key, coords] of Object.entries(this.locations)) {
      if (normalized.includes(key)) {
        return coords;
      }
    }

    // Default to Victoria Island
    return this.locations['vi'];
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Generate ride estimates based on distance
   */
  private generateEstimates(distance: number): RideEstimate[] {
    const basePricePerKm = 200; // ₦ per km
    const basePrice = 500; // Base fare
    const price = Math.round(basePrice + distance * basePricePerKm);

    // Add variance to prices
    const boltPrice = price;
    const uberPrice = Math.round(price * 1.15);
    const inDrivePrice = Math.round(price * 0.85);

    return [
      {
        provider: {
          name: 'Bolt',
          color: '#34D186',
          logo: {
            uri: 'https://ui-avatars.com/api/?name=Bolt&background=34D186&color=fff&size=96',
          },
        },
        price: boltPrice,
        eta: Math.round(3 + distance * 2.5),
        badge: 'recommended',
        distance,
      },
      {
        provider: {
          name: 'inDrive',
          color: '#FF6B00',
          logo: {
            uri: 'https://ui-avatars.com/api/?name=inDrive&background=FF6B00&color=fff&size=96',
          },
        },
        price: inDrivePrice,
        eta: Math.round(5 + distance * 2.5),
        badge: 'cheapest',
        distance,
      },
      {
        provider: {
          name: 'Uber',
          color: '#000000',
          logo: {
            uri: 'https://ui-avatars.com/api/?name=Uber&background=000000&color=fff&size=96',
          },
        },
        price: uberPrice,
        eta: Math.round(2 + distance * 2.5),
        badge: 'fastest',
        distance,
      },
    ];
  }

  /**
   * Determine time of day string
   */
  private getTimeOfDay(hour: number): string {
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const mockRideAPI = new MockRideAPI();
