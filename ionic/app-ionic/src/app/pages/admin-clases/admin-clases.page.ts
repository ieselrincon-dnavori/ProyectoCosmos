import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ModalController } from '@ionic/angular';
import { AlumnosModalPage } from '../alumnos-modal/alumnos-modal.page';

@Component({
  selector: 'app-admin-clases',
  templateUrl: './admin-clases.page.html',
  styleUrls: ['./admin-clases.page.scss'],
  standalone:false
})
export class AdminClasesPage implements OnInit {

  horarios:any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {

    this.adminService
      .getClasesAdmin()
      .subscribe(data => {

        this.horarios = data.sort(
          (a,b) => b.inscritos - a.inscritos
        );

        this.loading = false;
      });
  }

  async verAlumnos(id:number) {

    const modal = await this.modalCtrl.create({
      component: AlumnosModalPage,
      componentProps: {
        idHorario: id
      }
    });

    await modal.present();
  }

}
