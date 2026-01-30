import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/reservas';

  private baseUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  getReservasCliente(idCliente: number) {
    return this.http.get<any[]>(`${this.baseUrl}/cliente/${idCliente}`);
  }

  cancelarReserva(idReserva: number) {
    console.log('URL cancelación:', `${this.baseUrl}/${idReserva}/cancelar`);

    return this.http.patch(
      `${this.baseUrl}/${idReserva}/cancelar`,
      {}
    );
  }

  crearReserva(data: { id_cliente: number; id_horario: number }) {
  return this.http.post(this.baseUrl, data);
}

forzarCancelacion(idReserva: number) {
  return this.http.patch(
    `${this.apiUrl}/${idReserva}/forzar-cancelacion`,
    {}
  );
}
}
