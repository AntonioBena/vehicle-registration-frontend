import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { RegistrationRequest } from "../../models/RegistrationRequest";
import { AuthenticationRequest } from "../../models/AuthenticationRequest";
import { environment } from '../../Envinroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private apiUrl = environment.apiUrl;

  private baseUrl = 'http://localhost:8009/api/v1';

  constructor(private http: HttpClient){
    }

    public register(registrationRequest: RegistrationRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/account`, registrationRequest);
    }

    public login(authenticationRequest: AuthenticationRequest): Observable<any> {
      //return this.http.post<any>(`${this.baseUrl}/account/login`, authenticationRequest);
      return this.http.post<any>(`${this.baseUrl}/account/login`, authenticationRequest);
    }
}
