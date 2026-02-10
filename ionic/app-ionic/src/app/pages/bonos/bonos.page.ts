import { Component, OnInit } from '@angular/core';
import { BonoService } from '../../services/bono';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.page.html',
  styleUrls: ['./bonos.page.scss'],
  standalone:false
})
export class BonosPage implements OnInit {

  bonos:any[] = [];

  constructor(
    private bonoService:BonoService,
    private router:Router
  ) {}

  ngOnInit() {
    this.cargarBonos();
  }

  cargarBonos(){
    this.bonoService.getBonos().subscribe(res=>{
      this.bonos = res;
    });
  }

  comprar(bono:any){
    this.router.navigate(['/comprar-bono'],{
      state:{bono}
    });
  }

}
