import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCrearClasePage } from './admin-crear-clase.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCrearClasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCrearClasePageRoutingModule {}
