import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprarBonoPage } from './comprar-bono.page';

const routes: Routes = [
  {
    path: '',
    component: ComprarBonoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprarBonoPageRoutingModule {}
