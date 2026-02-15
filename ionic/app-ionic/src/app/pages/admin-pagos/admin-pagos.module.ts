import { isStandalone, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPagosPageRoutingModule } from './admin-pagos-routing.module';

import { AdminPagosPage } from './admin-pagos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPagosPageRoutingModule,
    
  ],
  declarations: [AdminPagosPage]
})
export class AdminPagosPageModule {}
