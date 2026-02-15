import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HorarioService } from '../../services/horario.service';

@Component({
  selector: 'app-alumnos-modal',
  templateUrl: './alumnos-modal.page.html',
  styleUrls: ['./alumnos-modal.page.scss'],
  standalone:false
})
export class AlumnosModalPage implements OnInit {

  @Input() idHorario!: number;

  alumnos:any[] = [];
  loading = true;

  constructor(
    private modalCtrl: ModalController,
    private horarioService: HorarioService
  ) {}

  ngOnInit() {

    this.horarioService
      .getAlumnosHorario(this.idHorario)
      .subscribe(data => {

        this.alumnos = data;
        this.loading = false;

      });

  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
