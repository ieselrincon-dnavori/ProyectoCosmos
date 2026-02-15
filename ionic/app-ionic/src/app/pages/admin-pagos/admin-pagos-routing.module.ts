import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPagosPage } from './admin-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPagosPageRoutingModule {}
