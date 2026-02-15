import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiBonoPageRoutingModule } from './mi-bono-routing.module';

import { MiBonoPage } from './mi-bono.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiBonoPageRoutingModule
  ],
  declarations: [MiBonoPage]
})
export class MiBonoPageModule {}
