import { Component, OnInit } from '@angular/core';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-admin-pagos',
  templateUrl: './admin-pagos.page.html',
  standalone: false,
  styleUrls: ['./admin-pagos.page.scss'],
})
export class AdminPagosPage implements OnInit {

  pagos: any[] = [];
  loading = true;

  constructor(private pagoService: PagoService) {}

  ngOnInit() {
    this.cargarPagos();
  }

  cargarPagos() {

    this.pagoService.getPagos().subscribe({

      next: (data) => {
        this.pagos = data;
        this.loading = false;
      },

      error: (err: any) => {
        console.error('Error cargando pagos', err);
        this.loading = false;
      }

    });
  }

  getEstadoColor(pago:any){

    if (pago.sesiones_restantes > 0)
      return 'success';

    if (pago.fecha_vencimiento) {

      const vence = new Date(pago.fecha_vencimiento);
      const hoy = new Date();

      if (vence > hoy)
        return 'primary';
    }

    return 'danger';
  }

  getEstadoTexto(pago:any){

    if (pago.sesiones_restantes > 0)
      return `${pago.sesiones_restantes} sesiones`;

    if (pago.fecha_vencimiento) {

      const vence = new Date(pago.fecha_vencimiento);
      const hoy = new Date();

      if (vence > hoy)
        return 'Activo';
    }

    return 'Caducado';
  }

}
