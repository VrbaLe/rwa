import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SalonInfoDto } from '../../dtos/salon-info.dto';
import { PaginationDto } from '../../dtos/pagination.dto';


@Injectable({
  providedIn: 'root'
})
export class SalonService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    loadSalons(pagination: PaginationDto = {}): Observable<SalonInfoDto[]> {
      let params = new HttpParams();
      if (pagination.skip !== undefined) params = params.set('skip', pagination.skip);
      if (pagination.limit !== undefined) params = params.set('limit', pagination.limit);
      return this.http.get<SalonInfoDto[]>(`${this.apiUrl}/salon`, { params });
    }

    selectSalon(id: number): Observable<SalonInfoDto> {
      return this.http.get<SalonInfoDto>(`${this.apiUrl}/salon/${id}`);
    }

    addNewSalon(salonData: FormData): Observable<SalonInfoDto> {
      return this.http.post<SalonInfoDto>(`${this.apiUrl}/salon`, salonData);
    }

    deleteSalon(id: number): Observable<unknown> {
      return this.http.delete(`${this.apiUrl}/salon/${id}`);
    }

}
