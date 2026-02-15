import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private api = `${environment.apiUrl}/horarios`;

  constructor(private http: HttpClient) {}

  /* =========================
     CLIENTE
  ========================= */

  getHorarios(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}?id_cliente=${idCliente}`
    );
  }


  /* =========================
     PROFESOR
  ========================= */

  getHorariosProfesor(idProfesor: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/profesor/${idProfesor}`
    );
  }


  /* =========================
     ADMIN 🔥 NUEVO
  ========================= */

  getClasesAdmin(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/admin/clases`
    );
  }
  getHorariosAdmin() {
  return this.http.get<any[]>(
    'http://localhost:3000/horarios/admin'
  );
}


  /* =========================
     CONTROL RESERVAS
  ========================= */

  cerrarReservas(idHorario: number) {
    return this.http.patch(
      `${this.api}/${idHorario}/cerrar`,
      {}
    );
  }

  abrirReservas(idHorario: number) {
    return this.http.patch(
      `${this.api}/${idHorario}/abrir`,
      {}
    );
  }

}
