import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDataDto } from '../../dtos/user.dto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  loadData(id: number): Observable<UserDataDto>{
    return this.http.get<UserDataDto>(`${this.apiUrl}/user/${id}`);
  }
}
