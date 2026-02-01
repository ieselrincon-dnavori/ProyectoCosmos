import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnosModalPageRoutingModule } from './alumnos-modal-routing.module';

import { AlumnosModalPage } from './alumnos-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnosModalPageRoutingModule
  ],
  declarations: [AlumnosModalPage]
})
export class AlumnosModalPageModule {}
