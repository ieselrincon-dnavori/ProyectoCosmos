import { Component, OnInit } from '@angular/core';
import { BonoService } from '../../services/bono';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-bono',
  templateUrl: './mi-bono.page.html',
  styleUrls: ['./mi-bono.page.scss'],
  standalone: false
})
export class MiBonoPage implements OnInit {

  bono:any=null;
  usuario:any;

  constructor(
    private bonoService:BonoService,
    private auth:AuthService
  ) {}

  ngOnInit() {

    this.usuario = this.auth.getUser();

    this.bonoService
      .getBonoActivo(this.usuario.id_usuario)
      .subscribe(res=>{

        if(res.activo){
          this.bono = res;
        }

      });

  }

}
