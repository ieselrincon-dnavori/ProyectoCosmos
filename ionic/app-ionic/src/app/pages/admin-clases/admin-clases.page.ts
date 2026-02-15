import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../services/horario.service';

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
    private horarioService: HorarioService
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {

    this.horarioService.getHorariosAdmin()
      .subscribe(data => {

        // 🔥 clases casi llenas arriba
        this.horarios = data.sort((a,b) => b.inscritos - a.inscritos);

        this.loading = false;
      });
  }

}
