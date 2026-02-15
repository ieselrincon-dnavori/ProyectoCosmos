import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonoService } from '../../services/bono';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { UserStateService } from '../../services/user-state.service';


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
    private loading:LoadingController,
    private userState: UserStateService
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

    this.bonoService.comprarBono(data).subscribe({

  next: async () => {

    await load.dismiss();

    this.userState.refreshBono(); // 🔥 refresh global

    const t = await this.toast.create({
      message:'✅ Bono activado',
      duration:2000,
      color:'success'
    });

    await t.present();

    this.router.navigate(['/mi-bono']);
  },

  error: async () => {

    await load.dismiss();

    const t = await this.toast.create({
      message:'Error en el pago',
      duration:2000,
      color:'danger'
    });

    await t.present();
  }

});


  }

}
