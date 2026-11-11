import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OwnerStatsDto } from '../../dtos/owner-stats.dto';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loadOwnerStats(): Observable<OwnerStatsDto> {
    return this.http.get<OwnerStatsDto>(`${this.apiUrl}/statistics/owner`);
  }
}