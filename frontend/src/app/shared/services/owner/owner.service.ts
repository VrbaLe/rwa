import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OwnerDto } from '../../dtos/owner.dto';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  loadOwners(): Observable<OwnerDto[]> {
    return this.http.get<OwnerDto[]>(`${this.apiUrl}/owner`);
  }

  selectOwner(id: number): Observable<OwnerDto> {
    return this.http.get<OwnerDto>(`${this.apiUrl}/owner/findById/${id}`);
  }

  updateOwner(id: number, ownerData: FormData): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/owner/${id}`, ownerData);
  }
}
