import { Injectable } from '@angular/core';
import { Observable, catchError, defer, from, of } from 'rxjs';
import { GeoPoint } from '../../dtos/geo-point.dto';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  // jedan zahtev ka OpenStreetMap-u (fetch umesto HttpClient, da interceptor ne salje token trecoj strani)
  search(query: string): Observable<GeoPoint | null> {
    return defer(() => from(this.fetchCoordinates(query))).pipe(catchError(() => of(null)));
  }

  private async fetchCoordinates(query: string): Promise<GeoPoint | null> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      countrycodes: 'rs'
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'Accept-Language': 'sr' }
    });
    if (!response.ok) {
      throw new Error('Pretraga adrese nije uspela');
    }

    const results = (await response.json()) as { lat: string; lon: string }[];
    return results.length
      ? { latitude: Number(results[0].lat), longitude: Number(results[0].lon) }
      : null;
  }
}