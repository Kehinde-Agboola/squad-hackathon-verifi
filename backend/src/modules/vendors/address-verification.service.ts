/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AddressVerificationService {
  private readonly logger = new Logger(AddressVerificationService.name);
  private readonly baseUrl = process.env.NOMINATIM_BASE_URL;

  async verifyAddress(address: string): Promise<{
    isValid: boolean;
    isInNigeria: boolean;
    formattedAddress: string | null;
    state: string | null;
    city: string | null;
    coordinates: { lat: number; lng: number } | null;
    confidence: 'high' | 'medium' | 'low';
    reason: string;
  }> {
    if (!address) {
      return this.failResult('No address provided for verification');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: `${address}, Nigeria`,
          format: 'json',
          addressdetails: 1,
          limit: 1,
          countrycodes: 'ng', // restrict to Nigeria
        },
        headers: {
          // Nominatim requires a User-Agent — use your app name
          'User-Agent': 'VendorShield/1.0 (vendorshield@yourdomain.com)',
        },
      });

      const results = response.data;

      if (!results || results.length === 0) {
        return this.failResult(`Address not found: "${address}"`);
      }

      const result = results[0];
      const addressDetails = result.address;

      // Confirm it's Nigeria
      const isInNigeria = addressDetails?.country_code === 'ng';
      if (!isInNigeria) {
        return this.failResult('Address resolves outside Nigeria');
      }

      // Extract state and city from Nominatim response
      const state = addressDetails?.state ?? addressDetails?.region ?? null;

      const city =
        addressDetails?.city ??
        addressDetails?.town ??
        addressDetails?.village ??
        addressDetails?.county ??
        null;

      // Nominatim importance score: 0-1, higher is more confident
      const importance = parseFloat(result.importance ?? '0');
      const confidence = this.getConfidence(importance);

      return {
        isValid: true,
        isInNigeria: true,
        formattedAddress: result.display_name,
        state,
        city,
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
        confidence,
        reason: `Address verified in ${city ?? ''}${city && state ? ', ' : ''}${state ?? ''} (${confidence} confidence)`,
      };
    } catch (err) {
      this.logger.error(
        `Address verification failed: ${(err as Error).message}`,
      );
      return this.failResult('Address verification service unavailable');
    }
  }

  private getConfidence(importance: number): 'high' | 'medium' | 'low' {
    if (importance >= 0.6) return 'high';
    if (importance >= 0.3) return 'medium';
    return 'low';
  }

  private failResult(reason: string) {
    return {
      isValid: false,
      isInNigeria: false,
      formattedAddress: null,
      state: null,
      city: null,
      coordinates: null,
      confidence: 'low' as const,
      reason,
    };
  }
}
