import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* ================= LOGIN ================= */

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          this.saveSession(res.token, res.user);
          this.userSubject.next(res.user); // 🔥 actualiza menú automáticamente
        })
      );
  }

  /* ================= STORAGE ================= */

  private getUserFromStorage() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return this.userSubject.value;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.getUser()?.rol ?? null;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.userSubject.next(null); // 🔥 fuerza actualización menú
  }
}
