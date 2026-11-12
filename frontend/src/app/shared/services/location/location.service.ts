import { Injectable } from '@angular/core';
import { Observable, defer, from, map } from 'rxjs';
import { GeoPoint } from '../../dtos/geo-point.dto';
import { GeocodingService } from '../geocoding/geocoding.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private geocodingService: GeocodingService) {}

  getCurrentPosition(): Observable<GeoPoint> {
    return defer(() =>
      from(
        new Promise<GeoPoint>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Vaš browser ne podržava određivanje lokacije.'));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            position => resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }),
            error => {
              console.warn('Geolokacija nije uspela:', error.code, error.message);
              reject(new Error(this.describe(error)));
            },
            { timeout: 15000, maximumAge: 60000 }
          );
        })
      )
    );
  }

  // lokacija iz adrese koju korisnik upise (kad browser ne moze sam da je odredi)
  locateByAddress(query: string): Observable<GeoPoint> {
    return this.geocodingService.search(query).pipe(
      map(point => {
        if (!point) {
          throw new Error('Adresa nije pronađena. Probaj sa ulicom, brojem i gradom.');
        }
        return point;
      })
    );
  }

  private describe(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Dozvola za lokaciju je odbijena. Uključi je preko ikone brave u adresnoj liniji.';
      case error.TIMEOUT:
        return 'Određivanje lokacije traje predugo. Pokušaj ponovo ili upiši svoju adresu.';
      default:
        return 'Browser ne može da odredi lokaciju na ovom računaru. Upiši svoju adresu ili grad.';
    }
  }
}