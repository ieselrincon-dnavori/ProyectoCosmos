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
  horariosFiltrados: any[] = [];

  textoBusqueda: string = '';
  filtroFecha: string = '';
  filtroProfesor: string = '';

  profesoresUnicos: string[] = [];

  user: any;

  constructor(
    private horarioService: HorarioService,
    private reservaService: ReservaService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private userState: UserStateService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarHorarios();
  }

  ionViewWillEnter() {
    this.cargarHorarios();
  }

  cargarHorarios() {

    this.horarioService
      .getHorarios(this.user.id_usuario)
      .subscribe({
        next: data => {

          this.horarios = data;
          this.horariosFiltrados = [...this.horarios];

          this.profesoresUnicos = [
            ...new Set(
              this.horarios.map(h =>
                `${h.Clase?.profesor?.nombre} ${h.Clase?.profesor?.apellidos}`
              )
            )
          ];

          this.aplicarFiltros();
        },

        error: err => {
          if (err.status === 403) {
            this.horarios = [];
            this.horariosFiltrados = [];
            return;
          }

          console.error("Error cargando horarios:", err);
        }
      });
  }

  aplicarFiltros() {

    let resultado = [...this.horarios];

    if (this.textoBusqueda) {

      const texto = this.textoBusqueda.toLowerCase();

      resultado = resultado.filter(h =>
        h.Clase?.nombre_clase?.toLowerCase().includes(texto)
      );
    }

    if (this.filtroFecha) {
      resultado = resultado.filter(h =>
        h.fecha === this.filtroFecha
      );
    }

    if (this.filtroProfesor) {

      resultado = resultado.filter(h => {

        const nombreCompleto =
          `${h.Clase?.profesor?.nombre} ${h.Clase?.profesor?.apellidos}`;

        return nombreCompleto === this.filtroProfesor;
      });
    }

    this.horariosFiltrados = resultado;
  }

  reservar(horario: any) {

    this.reservaService.crearReserva({
      id_cliente: this.user.id_usuario,
      id_horario: horario.id_horario
    }).subscribe({
      next: () => {
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

  getIconoClase(nombre: string): string {

  if (!nombre) return 'fitness-outline';

  const n = nombre.toLowerCase();

  if (n.includes('yoga')) return 'leaf-outline';
  if (n.includes('pilates')) return 'body-outline';
  if (n.includes('spinning')) return 'bicycle-outline';
  if (n.includes('crossfit')) return 'barbell-outline';
  if (n.includes('box')) return 'flash-outline';
  if (n.includes('zumba')) return 'musical-notes-outline';

  return 'fitness-outline';
}

getClaseColor(nombre: string): string {

  if (!nombre) return 'default';

  const n = nombre.toLowerCase();

  if (n.includes('yoga')) return 'yoga';
  if (n.includes('pilates')) return 'pilates';
  if (n.includes('spinning')) return 'spinning';
  if (n.includes('crossfit')) return 'crossfit';
  if (n.includes('box')) return 'box';
  if (n.includes('zumba')) return 'zumba';

  return 'default';
}

}