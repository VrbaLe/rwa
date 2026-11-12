import { Injectable, Logger } from '@nestjs/common';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const COUNTRY_CODES = 'rs'; // samo Srbija, obrisi ako ti treba cela planeta

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  // prvo probava "adresa, grad", a ako ne nadje, samo grad
  async geocode(address?: string | null, city?: string | null): Promise<Coordinates | null> {
    const full = [address, city].filter((part) => !!part && part.trim() !== '').join(', ');
    const queries = [...new Set([full, city ?? ''].map((query) => query.trim()).filter((query) => query !== ''))];

    for (const query of queries) {
      const result = await this.search(query);
      if (result) {
        return result;
      }
    }
    return null;
  }

  private async search(query: string): Promise<Coordinates | null> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      countrycodes: COUNTRY_CODES,
    });

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'User-Agent': 'salon-app-student-project/1.0', 'Accept-Language': 'sr' },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        this.logger.warn(`Geokodiranje: odgovor ${response.status} za "${query}"`);
        return null;
      }
      const results = (await response.json()) as { lat: string; lon: string }[];
      return results.length
        ? { latitude: Number(results[0].lat), longitude: Number(results[0].lon) }
        : null;
    } catch {
      this.logger.warn(`Geokodiranje nije uspelo za "${query}"`);
      return null;
    }
  }
}