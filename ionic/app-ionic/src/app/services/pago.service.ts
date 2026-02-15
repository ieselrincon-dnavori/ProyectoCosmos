import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private api = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  /* =========================
     ADMIN
  ========================= */

  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  crearPago(data: {
    id_cliente: number;
    id_bono: number;
    metodo_pago: string;
  }): Observable<any> {

    return this.http.post(this.api, data);
  }


  /* =========================
     CLIENTE
  ========================= */

  getPagosCliente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/cliente/${id}`);
  }

  getBonoActivo(id: number): Observable<any> {
    return this.http.get(`${this.api}/cliente/${id}/activo`);
  }

}
