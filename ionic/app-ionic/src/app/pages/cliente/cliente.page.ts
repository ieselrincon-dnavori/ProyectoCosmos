import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReservaService } from '../../services/reserva.service';
import { HorarioService } from '../../services/horario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss']
})
export class ClientePage implements OnInit {

  user: any;

  // 🔹 NUEVO
  horarios: any[] = [];

  // 🔹 EXISTENTE
  reservas: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private horarioService: HorarioService,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarHorarios();
    this.cargarReservas();
  }

  // =====================
  // HORARIOS
  // =====================
  cargarHorarios() {
    this.horarioService.getHorarios(this.user.id_usuario).subscribe({
      next: data => this.horarios = data,
      error: err => console.error(err)
    });
  }

  get tieneReservasActivas(): boolean {
  return this.reservas.some(r => r.estado === 'activa');
}

  reservar(idHorario: number) {
    this.reservaService.crearReserva({
      id_cliente: this.user.id_usuario,
      id_horario: idHorario
    }).subscribe({
      next: () => {
        this.cargarReservas();
        alert('Reserva realizada ✅');
      },
      error: err => {
        alert(err.error?.error || 'No se pudo reservar');
      }
    });
  }

 
  cargarReservas() {
    this.reservaService.getReservasCliente(this.user.id_usuario)
      .subscribe({
        next: data => this.reservas = data,
        error: err => console.error(err)
      });
  }

  async cancelar(reserva: any) {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar reserva',
      message: '¿Seguro que deseas cancelar esta reserva?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.reservaService
              .cancelarReserva(reserva.id_reserva)
              .subscribe(() => this.cargarReservas());
          }
        }
      ]
    });

    await alert.present();
  }
}
