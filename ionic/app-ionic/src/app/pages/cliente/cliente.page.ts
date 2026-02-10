import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReservaService } from '../../services/reserva.service';
import { HorarioService } from '../../services/horario.service';
import { AuthService } from '../../services/auth.service';
import { BonoService } from '../../services/bono';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss']
})
export class ClientePage implements OnInit {

  user: any;

  horarios: any[] = [];
  reservas: any[] = [];

  // 🔥 NUEVO
  bonoActivo: any = null;
  cargandoBono = true;

  constructor(
    private reservaService: ReservaService,
    private horarioService: HorarioService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private bonoService: BonoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();

    this.verificarBono(); // 🔥 PRIMERO
    this.cargarReservas();
  }

  // =====================
  // BONO
  // =====================

  verificarBono() {

    this.bonoService
      .getBonoActivo(this.user.id_usuario)
      .subscribe({
        next: res => {

          // ⚠️ tu backend devuelve {activo:false}
          if (!res.activo) {
            this.bonoActivo = null;
            this.cargandoBono = false;
            return;
          }

          this.bonoActivo = res;
          this.cargandoBono = false;

          // SOLO cargamos horarios si tiene bono
          this.cargarHorarios();
        },
        error: () => {
          this.bonoActivo = null;
          this.cargandoBono = false;
        }
      });
  }

  irComprarBono(){
    this.router.navigate(['/bonos']);
  }

  // =====================
  // HORARIOS
  // =====================

  cargarHorarios() {

    if(!this.bonoActivo) return;

    this.horarioService
      .getHorarios(this.user.id_usuario)
      .subscribe({
        next: data => this.horarios = data,
        error: err => console.error(err)
      });
  }

  get tieneReservasActivas(): boolean {
    return this.reservas.some(r => r.estado === 'activa');
  }

  reservar(idHorario: number) {

    // 🔥 doble seguridad UX
    if(!this.bonoActivo){
      alert('Necesitas un bono activo');
      return;
    }

    this.reservaService.crearReserva({
      id_cliente: this.user.id_usuario,
      id_horario: idHorario
    }).subscribe({
      next: () => {

        // 🔥 reduce sesiones visualmente sin recargar
        if(this.bonoActivo.sesiones_restantes !== null){
          this.bonoActivo.sesiones_restantes--;
        }

        this.cargarReservas();

        alert('Reserva realizada ✅');
      },
      error: err => {
        alert(err.error?.error || 'No se pudo reservar');
      }
    });
  }

  // =====================
  // RESERVAS
  // =====================

  cargarReservas() {

    this.reservaService
      .getReservasCliente(this.user.id_usuario)
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
              .subscribe(() => {

                
                if(this.bonoActivo?.sesiones_restantes !== null){
                  this.bonoActivo.sesiones_restantes++;
                }

                this.cargarReservas();
              });

          }
        }
      ]
    });

    await alert.present();
  }
}
