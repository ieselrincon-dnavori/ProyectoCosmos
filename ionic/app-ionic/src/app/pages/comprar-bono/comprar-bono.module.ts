import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprarBonoPageRoutingModule } from './comprar-bono-routing.module';

import { ComprarBonoPage } from './comprar-bono.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprarBonoPageRoutingModule
  ],
  declarations: [ComprarBonoPage]
})
export class ComprarBonoPageModule {}
