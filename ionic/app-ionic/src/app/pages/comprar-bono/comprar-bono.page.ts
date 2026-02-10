import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonoService } from '../../services/bono';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-comprar-bono',
  templateUrl: './comprar-bono.page.html',
  styleUrls: ['./comprar-bono.page.scss'],
  standalone: false
})
export class ComprarBonoPage implements OnInit {

  bono:any;
  usuario:any;

  constructor(
    private router:Router,
    private bonoService:BonoService,
    private auth:AuthService,
    private toast:ToastController,
    private loading:LoadingController
  ) {}

  ngOnInit() {

    this.bono = history.state.bono;
    this.usuario = this.auth.getUser();

    if(!this.bono){
      this.router.navigate(['/bonos']);
    }
  }

  async confirmarCompra(){

    const load = await this.loading.create({
      message:'Procesando pago...'
    });

    await load.present();

    const data = {
      id_cliente:this.usuario.id_usuario,
      id_bono:this.bono.id_bono,
      metodo_pago:'app'
    };

    this.bonoService.comprarBono(data).subscribe(async ()=>{

      load.dismiss();

      const t = await this.toast.create({
        message:'✅ Bono activado',
        duration:2000,
        color:'success'
      });

      t.present();

      this.router.navigate(['/mi-bono']);

    }, async ()=>{

      load.dismiss();

      const t = await this.toast.create({
        message:'Error en el pago',
        duration:2000,
        color:'danger'
      });

      t.present();

    });

  }

}
