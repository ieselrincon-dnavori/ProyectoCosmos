import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AdminService } from '../../services/admin.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  standalone: false,
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  usuarios:any[] = [];
  dashboard:any = null;

  constructor(
    private usuarioService: UsuarioService,
    private adminService: AdminService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {

    this.cargarUsuarios();
    this.cargarDashboard(); // 🔥 FALTABA ESTO

  }

  cargarDashboard() {

    this.adminService
      .getDashboard()
      .subscribe(data => {

        console.log("🔥 DASHBOARD:", data); // DEBUG

        this.dashboard = data;
      });

  }

  cargarUsuarios() {
    this.usuarioService.getUsuariosAdmin()
      .subscribe((data:any[]) => this.usuarios = data);
  }

  toggle(usuario:any) {
    this.usuarioService.toggleActivo(usuario.id_usuario)
      .subscribe(() => this.cargarUsuarios());
  }

}
