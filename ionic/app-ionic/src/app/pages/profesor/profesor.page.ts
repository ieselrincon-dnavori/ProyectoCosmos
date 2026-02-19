import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { HorarioService } from '../../services/horario.service';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';
import { AlumnosModalPage } from '../alumnos-modal/alumnos-modal.page';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: false
})
export class ProfesorPage implements OnInit {

  horarios: any[] = [];
  user: any;

  ordenActual: string = 'fecha';

  constructor(
    private horarioService: HorarioService,
    private auth: AuthService,
    private reservaService: ReservaService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarHorarios();
  }

  /* =========================
     CARGAR HORARIOS
  ========================= */

  cargarHorarios() {
    this.horarioService
      .getHorariosProfesor(this.user.id_usuario)
      .subscribe({
        next: data => {
          this.horarios = data.map(h => ({
            ...h,
            mostrarAlumnos: false
          }));

          this.ordenar();
        },
        error: err => console.error(err)
      });
  }

  /* =========================
     ORDENAR
  ========================= */

  ordenar() {

    if (this.ordenActual === 'fecha') {

      this.horarios.sort((a, b) =>
        new Date(a.fecha + ' ' + a.hora_inicio).getTime()
        - new Date(b.fecha + ' ' + b.hora_inicio).getTime()
      );

    } else if (this.ordenActual === 'alumnos') {

      this.horarios.sort((a, b) =>
        (b.plazas_ocupadas || 0)
        - (a.plazas_ocupadas || 0)
      );

    }

  }

  /* =========================
     CANCELAR ALUMNO
  ========================= */

  async cancelarAlumno(reserva: any) {

    const alert = await this.alertCtrl.create({
      header: 'Cancelar reserva',
      message: `¿Cancelar la reserva de ${reserva.Usuario.nombre} ${reserva.Usuario.apellidos}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí',
          handler: () => {
            this.reservaService
              .forzarCancelacion(reserva.id_reserva)
              .subscribe(() => this.cargarHorarios());
          }
        }
      ]
    });

    await alert.present();
  }

  /* =========================
     MODAL VER ALUMNOS
  ========================= */

  async verAlumnos(horario: any) {

    const modal = await this.modalCtrl.create({
      component: AlumnosModalPage,
      componentProps: {
        idHorario: horario.id_horario
      }
    });

    await modal.present();
  }

  /* =========================
     ABRIR / CERRAR RESERVAS
  ========================= */

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
