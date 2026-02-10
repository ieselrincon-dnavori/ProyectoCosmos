import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BonosPageRoutingModule } from './bonos-routing.module';

import { BonosPage } from './bonos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BonosPageRoutingModule
  ],
  declarations: [BonosPage]
})
export class BonosPageModule {}
