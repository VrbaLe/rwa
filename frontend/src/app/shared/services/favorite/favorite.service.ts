import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loadFavorites(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/favorites`);
  }

  addFavorite(salonId: number): Observable<{ salonId: number }> {
    return this.http.post<{ salonId: number }>(`${this.apiUrl}/favorites/${salonId}`, {});
  }

  removeFavorite(salonId: number): Observable<{ salonId: number }> {
    return this.http.delete<{ salonId: number }>(`${this.apiUrl}/favorites/${salonId}`);
  }
}