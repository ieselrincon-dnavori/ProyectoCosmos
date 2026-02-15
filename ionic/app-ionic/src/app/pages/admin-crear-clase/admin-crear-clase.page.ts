import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-crear-clase',
  templateUrl: './admin-crear-clase.page.html',
  standalone:false
})
export class AdminCrearClasePage implements OnInit {

  profesores:any[] = [];

  clase = {
    nombre_clase: '',
    id_profesor: null,
    capacidad_maxima: 10
  };

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.adminService
      .getProfesores()
      .subscribe(p => this.profesores = p);
  }

  crear() {

    this.adminService
      .crearClase(this.clase)
      .subscribe(() => {

        this.router.navigate(['/admin-clases']);

      });

  }

}
