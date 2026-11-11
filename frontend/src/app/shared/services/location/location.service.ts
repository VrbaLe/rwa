import { Injectable } from '@angular/core';
import { Observable, defer, from } from 'rxjs';
import { GeoPoint } from '../../dtos/geo-point.dto';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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
            error => reject(new Error(
              error.code === error.PERMISSION_DENIED
                ? 'Dozvola za lokaciju je odbijena.'
                : 'Lokacija trenutno nije dostupna.'
            )),
            { timeout: 10000, maximumAge: 60000 }
          );
        })
      )
    );
  }
}