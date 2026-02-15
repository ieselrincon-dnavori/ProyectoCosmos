import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-alumnos-modal',
  templateUrl: './alumnos-modal.page.html',
  styleUrls: ['./alumnos-modal.page.scss'],
  standalone:false
})
export class AlumnosModalPage {

  @Input() reservas: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private reservaService: ReservaService
  ) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  cancelar(reserva: any) {
    this.reservaService
      .forzarCancelacion(reserva.id_reserva)
      .subscribe(() => {

        // eliminar de la lista visualmente
        this.reservas = this.reservas.filter(
          r => r.id_reserva !== reserva.id_reserva
        );

      });
  }
}
