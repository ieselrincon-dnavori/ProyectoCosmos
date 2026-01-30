import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private apiUrl = 'http://localhost:3000/horarios';

  constructor(private http: HttpClient) {}

  getHorarios(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?id_cliente=${idCliente}`);
  }

/** 
  getHorariosProfesor(idProfesor: number): Observable<any[]> {
  return this.http.get<any[]>(
    `http://localhost:3000/horarios/profesor/${idProfesor}`
  );
}
*/
cerrarReservas(idHorario: number) {
  return this.http.patch(
    `http://localhost:3000/horarios/${idHorario}/cerrar`,
    {}
  );
}

abrirReservas(idHorario: number) {
  return this.http.patch(
    `http://localhost:3000/horarios/${idHorario}/abrir`,
    {}
  );
}
getHorariosProfesor(idProfesor: number) {
  return this.http.get<any[]>(
    `http://localhost:3000/horarios/profesor/${idProfesor}`
  );
}

}
