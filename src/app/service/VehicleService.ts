import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../Envinroment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { VehicleDto } from '../models/VehicleDto';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = environment.apiUrl;

  private baseUrl = 'http://localhost:8009/api/v1';

  constructor(private http: HttpClient) {}

  public checkRegisteredVehicle(registrationCode: string): Observable<any> {
    const headers = new HttpHeaders({
      RegistrationCode: registrationCode,
    });
    return this.http.get<any>(`${this.baseUrl}/registration/registrationCode`, {
      headers,
    });
  }

  public registerNewVehicle(vehicleRequest: VehicleDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, vehicleRequest);
  }
}
