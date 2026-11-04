import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTreatmentDto, TreatmentDto } from '../../dtos/treatment.dto';


@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  create(treatment: CreateTreatmentDto): Observable<TreatmentDto> {
    return this.http.post<TreatmentDto>(`${this.apiUrl}/treatments`, treatment);
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/treatments/${id}`);
  }
}
