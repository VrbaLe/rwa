import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { CreateAppointmentDto } from '../../dtos/create-appointment.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl =  environment.apiUrl;

  constructor(private http: HttpClient) { }

  loadAppointments(): Observable<AppointmentDto[]> {
    return this.http.get<AppointmentDto[]>(`${this.apiUrl}/appointments`);
  }

  createAppointment(appointment: CreateAppointmentDto): Observable<AppointmentDto> {
    return this.http.post<AppointmentDto>(`${this.apiUrl}/appointments`, appointment);
  }

  deleteAppointment(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/appointments/${id}`);
  }
}
