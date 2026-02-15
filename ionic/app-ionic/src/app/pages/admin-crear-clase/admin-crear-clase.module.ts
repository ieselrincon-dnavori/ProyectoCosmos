import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCrearClasePageRoutingModule } from './admin-crear-clase-routing.module';

import { AdminCrearClasePage } from './admin-crear-clase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCrearClasePageRoutingModule
  ],
  declarations: [AdminCrearClasePage]
})
export class AdminCrearClasePageModule {}
