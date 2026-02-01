import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private api = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuariosAdmin() {
    return this.http.get<any[]>(`${this.api}/admin`);
  }

  toggleActivo(id:number) {
    return this.http.patch(`${this.api}/${id}/toggle-activo`, {});
  }

  crearUsuario(usuario:any){
  return this.http.post(
    'http://localhost:3000/usuarios/admin',
    usuario
  );
}


  crearUsuarioAdmin(data: any) {
  return this.http.post(
    'http://localhost:3000/usuarios/admin',
    data
  );


}


}
export class ReservaService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReservasCliente(idCliente: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/reservas/cliente/${idCliente}`
    );
  }
}



