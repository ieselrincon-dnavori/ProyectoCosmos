import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../services/horario.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
  standalone: false,
})
export class HorariosPage implements OnInit {

  horarios: any[] = [];
  user: any;

  constructor(
    private horarioService: HorarioService,
    private reservaService: ReservaService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private userState: UserStateService  // 🔥 Añadido
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarHorarios();
  }

  // 🔥 SOLUCIÓN: Recargar al entrar a la página
  ionViewWillEnter() {
    this.cargarHorarios();
  }

  cargarHorarios() {
    this.horarioService
      .getHorarios(this.user.id_usuario)
      .subscribe({
        next: data => this.horarios = data,

        error: err => {
          // 🔥 si no tiene bono → fuera
          if (err.status === 403) {
            this.horarios = [];
            return;
          }

          console.error("Error cargando horarios:", err);
        }
      });
  }

  reservar(horario: any) {
    this.reservaService.crearReserva({
      id_cliente: this.user.id_usuario,
      id_horario: horario.id_horario
    }).subscribe({
      next: () => {
        // 🔥 SOLUCIÓN: Actualizar estado global después de reservar
        this.userState.loadBono();
        this.cargarHorarios();
      },
      error: err => this.mostrarError(err.error?.error || 'Error al reservar')
    });
  }

  async mostrarError(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Reserva',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}