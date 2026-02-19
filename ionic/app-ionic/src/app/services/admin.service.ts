import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService } from './api.service';

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

  private base = '/admin';

  constructor(private api: ApiService) {}

  /* =========================
     DASHBOARD (CACHEADO 🔥)
  ========================= */

  dashboard$: Observable<Dashboard> =
    this.api
      .get<Dashboard>(`${this.base}/dashboard`)
      .pipe(shareReplay(1));

  getDashboard(): Observable<Dashboard> {
    return this.dashboard$;
  }

  /* ========================= */

  refreshDashboard() {
    this.dashboard$ =
      this.api
        .get<Dashboard>(`${this.base}/dashboard`)
        .pipe(shareReplay(1));
  }

  /* ========================= */

  getProfesores(): Observable<any[]> {
    return this.api.get<any[]>(`${this.base}/profesores`);
  }

  getClasesAdmin(): Observable<any[]> {
    return this.api.get<any[]>(`${this.base}/clases`);
  }

  crearClase(data:any){
    return this.api.post(`${this.base}/clases`, data);
  }
  getIngresosChart(){
  return this.api.get<any[]>('/admin/dashboard-chart');
}


}
