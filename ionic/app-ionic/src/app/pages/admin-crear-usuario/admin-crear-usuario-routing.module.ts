import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCrearUsuarioPage } from './admin-crear-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCrearUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCrearUsuarioPageRoutingModule {}
