import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dashboard {
  clientes_activos: number;
  ingresos_mes: number;
  clases_hoy: number;
  ocupacion_media: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiAdmin = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  /* =========================
     DASHBOARD
  ========================= */

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(
      `${this.apiAdmin}/dashboard`
    );
  }

  /* =========================
     PROFESORES (ADMIN)
  ========================= */

  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiAdmin}/profesores`
    );
  }

  /* =========================
     CLASES ADMIN
  ========================= */

  getClasesAdmin(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiAdmin}/clases`
    );
  }

  /* =========================
     CREAR CLASE
  ========================= */

  crearClase(data: any) {
    return this.http.post(
      `${this.apiAdmin}/clases`,
      data
    );
  }

}
