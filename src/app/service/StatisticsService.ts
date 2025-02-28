import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../Envinroment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

  private baseUrl = 'http://localhost:8009/api/v1';

  constructor(private http: HttpClient) {}

  public getMyStatistics(accountId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics/${accountId}`);
  }

  public getAllStatistics(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseUrl}/statistics/all-accounts`);
  }
}
