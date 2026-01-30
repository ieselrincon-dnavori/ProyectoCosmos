import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HorarioService } from '../../services/horario.service';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: false
})
export class ProfesorPage implements OnInit {

  horarios: any[] = [];
  user: any;

  constructor(
    private horarioService: HorarioService,
    private auth: AuthService,
    private reservaService: ReservaService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarHorarios();
  }

  cargarHorarios() {
    this.horarioService.getHorariosProfesor(this.user.id_usuario)
      .subscribe({
        next: data => this.horarios = data,
        error: err => console.error(err)
      });
  }

  async cancelarAlumno(reserva: any) {

  const alert = await this.alertCtrl.create({
    header: 'Cancelar reserva',
    message: `¿Cancelar la reserva de ${reserva.Usuario.nombre} ${reserva.Usuario.apellidos}?`,
    buttons: [
      { text: 'No', role: 'cancel' },
      {
        text: 'Sí',
        handler: () => {
          this.reservaService.forzarCancelacion(reserva.id_reserva)
            .subscribe(() => this.cargarHorarios());
        }
      }
    ]
  });

  await alert.present();
}
async verAlumnos(horario: any) {

  const alumnos = horario.alumnos || [];

  if (alumnos.length === 0) {
    const alert = await this.alertCtrl.create({
      header: 'Alumnos inscritos',
      message: 'No hay alumnos inscritos en este horario.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const lista = alumnos
    .map((a: any) => `• ${a.nombre} ${a.apellidos}`)
    .join('<br>');

  const alert = await this.alertCtrl.create({
    header: 'Alumnos inscritos',
    message: lista,
    buttons: ['Cerrar']
  });

  await alert.present();
}



  async cambiarEstado(horario: any) {

    const accion = horario.reservas_abiertas ? 'cerrar' : 'abrir';

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Deseas ${accion} las reservas de este horario?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí',
          handler: () => {
            const obs = horario.reservas_abiertas
              ? this.horarioService.cerrarReservas(horario.id_horario)
              : this.horarioService.abrirReservas(horario.id_horario);

            obs.subscribe(() => this.cargarHorarios());
          }
        }
      ]
    });

    await alert.present();
  }
}



