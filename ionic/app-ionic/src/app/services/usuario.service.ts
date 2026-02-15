import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuariosAdmin() {
    return this.http.get<any[]>(`${this.api}/admin`);
  }

  toggleActivo(id: number) {
    return this.http.patch(
      `${this.api}/${id}/toggle-activo`,
      {}
    );
  }

  crearUsuarioAdmin(data: any) {
    return this.http.post(
      `${this.api}/admin`,
      data
    );
  }
}
