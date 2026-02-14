import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { BonoService } from '../../services/bono';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: false,
})
export class ClientePage implements OnInit {

  reservas: any[] = [];
  reservasActivas: number = 0;

  bonoActivo: any = null;
  cargandoBono: boolean = true;

  user: any;

  constructor(
    private reservaService: ReservaService,
    private bonoService: BonoService,
    private auth: AuthService,
    private router: Router,
    private userState: UserStateService  // 🔥 Añadido
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.cargarBono();
    this.cargarReservas();
  }

  // 🔥 SOLUCIÓN: Usar ionViewWillEnter para recargar al volver a la página
  ionViewWillEnter() {
    this.cargarBono();
    this.cargarReservas();
  }

  // 🔥 BONO
  cargarBono() {
    this.cargandoBono = true;

    this.bonoService
      .getBonoActivo(this.user.id_usuario)
      .subscribe({
        next: (bono) => {
          this.bonoActivo = bono;
          this.cargandoBono = false;
          
          // 🔥 SOLUCIÓN: Actualizar estado global
          this.userState.setBono(bono);
        },

        error: () => {
          this.bonoActivo = null;
          this.cargandoBono = false;
          
          // 🔥 SOLUCIÓN: Limpiar estado global si no hay bono
          this.userState.setBono(null);
        }
      });
  }

  // 🔥 RESERVAS
  cargarReservas() {
    this.reservaService
      .getReservasCliente(this.user.id_usuario)
      .subscribe({
        next: (data: any[]) => {
          this.reservas = data;

          // ⭐ CALCULO FUERA DEL HTML
          this.reservasActivas = this.reservas
            .filter(r => r.estado === 'activa')
            .length;
        },

        error: err => console.error(err)
      });
  }

  cancelar(reserva: any) {
    this.reservaService
      .cancelarReserva(reserva.id_reserva)
      .subscribe(() => {
        // 🔥 SOLUCIÓN: Recargar todo después de cancelar
        this.cargarReservas();
        this.cargarBono();  // Por si cambió el número de sesiones
      });
  }

  irComprarBono() {
    this.router.navigate(['/bonos']);
  }
}