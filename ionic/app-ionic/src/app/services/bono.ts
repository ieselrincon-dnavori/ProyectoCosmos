import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonoService {

  constructor(private api: ApiService) {}

  getBonos(): Observable<any> {
    return this.api.get('/bonos');
  }

  getBonoActivo(idCliente: number): Observable<any> {
    return this.api.get(`/pagos/cliente/${idCliente}/activo`);
  }

  comprarBono(data:any): Observable<any> {
    return this.api.post('/pagos', data);
  }

  getPagosCliente(id:number){
    return this.api.get(`/pagos/cliente/${id}`);
  }
}
