import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getArtistes() {
    return this.http.get<any[]>(`${this.apiUrl}/artistes`);
  }

  getAlbums() {
    return this.http.get<any[]>(`${this.apiUrl}/albums`);
  }

  getMorceaux() {
    return this.http.get<any[]>(`${this.apiUrl}/morceaux`);
  }
}