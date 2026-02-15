import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get(endpoint:string){
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }

  post(endpoint:string, body:any){
    return this.http.post(`${this.baseUrl}${endpoint}`, body);
  }

  patch(endpoint:string, body:any){
    return this.http.patch(`${this.baseUrl}${endpoint}`, body);
  }

  delete(endpoint:string){
    return this.http.delete(`${this.baseUrl}${endpoint}`);
  }
}
