import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  standalone: false,
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  usuarios:any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuariosAdmin()
      .subscribe((data:any[]) => this.usuarios = data);
  }

  toggle(usuario:any) {
    this.usuarioService.toggleActivo(usuario.id_usuario)
      .subscribe(() => this.cargarUsuarios());
  }

  async crearUsuario() {

  const alert = await this.alertCtrl.create({
    header: 'Nuevo usuario',
    inputs: [
      { name: 'nombre', placeholder: 'Nombre', type: 'text' },
      { name: 'apellidos', placeholder: 'Apellidos', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Contraseña', type: 'password' },
      { name: 'telefono', placeholder: 'Teléfono', type: 'text' },
      {
        name: 'rol',
        type: 'radio',
        label: 'Cliente',
        value: 'cliente',
        checked: true
      },
      {
        name: 'rol',
        type: 'radio',
        label: 'Profesor',
        value: 'profesor'
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Crear',
        handler: (data) => {

          const payload = {
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email,
            contraseña_hash: data.password,
            telefono: data.telefono,
            rol: data.rol
          };

          this.usuarioService.crearUsuarioAdmin(payload)
            .subscribe(() => this.cargarUsuarios());
        }
      }
    ]
  });

  await alert.present();
}

}