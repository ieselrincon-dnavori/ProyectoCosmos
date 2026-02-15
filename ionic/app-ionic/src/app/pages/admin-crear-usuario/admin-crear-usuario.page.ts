import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-crear-usuario',
  templateUrl: './admin-crear-usuario.page.html',
  styleUrls: ['./admin-crear-usuario.page.scss'],
  standalone:false
})
export class AdminCrearUsuarioPage {

  usuario: any = {
    rol: 'cliente'
  };

  constructor(
    private usuarioService: UsuarioService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async crearUsuario() {

    if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password_hash) {
      return this.mostrarAlert('Faltan campos obligatorios');
    }

    this.usuarioService.crearUsuarioAdmin(this.usuario)

      .subscribe({
        next: async () => {

          const alert = await this.alertCtrl.create({
            header: 'Éxito',
            message: 'Usuario creado correctamente',
            buttons: ['OK']
          });

          await alert.present();

          this.router.navigate(['/admin']);
        },
        error: err => {
          this.mostrarAlert(err.error?.error || 'Error creando usuario');
        }
      });
  }

  async mostrarAlert(msg:string){
    const alert = await this.alertCtrl.create({
      header:'Error',
      message:msg,
      buttons:['OK']
    });

    await alert.present();
  }

}
