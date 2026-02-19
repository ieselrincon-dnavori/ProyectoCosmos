import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ModalController } from '@ionic/angular';
import { AlumnosModalPage } from '../alumnos-modal/alumnos-modal.page';

@Component({
  selector: 'app-admin-clases',
  templateUrl: './admin-clases.page.html',
  styleUrls: ['./admin-clases.page.scss'],
  standalone: false
})
export class AdminClasesPage implements OnInit {

  horarios: any[] = [];
  horariosFiltrados: any[] = [];

  profesoresUnicos: string[] = [];

  filtroFecha: string = '';
  filtroProfesor: string = '';
  ordenActual: string = 'fecha';

  loading = true;

  constructor(
    private adminService: AdminService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cargar();
  }

  /* =========================
     CARGAR DATOS
  ========================= */

  cargar() {

    this.adminService
      .getClasesAdmin()
      .subscribe(data => {

        this.horarios = data;

        // Extraer profesores únicos
        this.profesoresUnicos = [
          ...new Set(this.horarios.map(h => h.profesor))
        ];

        this.aplicarFiltros();
        this.loading = false;
      });
  }

  /* =========================
     FILTRAR Y ORDENAR
  ========================= */

  aplicarFiltros() {

    let resultado = [...this.horarios];

    // FILTRO FECHA
    if (this.filtroFecha) {
      resultado = resultado.filter(h =>
        h.fecha === this.filtroFecha
      );
    }

    // FILTRO PROFESOR
    if (this.filtroProfesor) {
      resultado = resultado.filter(h =>
        h.profesor === this.filtroProfesor
      );
    }

    // ORDEN
    if (this.ordenActual === 'fecha') {

      resultado.sort((a, b) =>
        new Date(a.fecha + ' ' + a.hora_inicio).getTime()
        - new Date(b.fecha + ' ' + b.hora_inicio).getTime()
      );

    } else if (this.ordenActual === 'ocupacion') {

      resultado.sort((a, b) =>
        (b.inscritos / b.capacidad)
        - (a.inscritos / a.capacidad)
      );

    }

    this.horariosFiltrados = resultado;
  }

  /* =========================
     MODAL ALUMNOS
  ========================= */

  async verAlumnos(id: number) {

    const modal = await this.modalCtrl.create({
      component: AlumnosModalPage,
      componentProps: {
        idHorario: id
      }
    });

    await modal.present();
  }

}
