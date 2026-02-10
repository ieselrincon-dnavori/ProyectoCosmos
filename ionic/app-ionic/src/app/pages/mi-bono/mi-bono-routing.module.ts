import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiBonoPage } from './mi-bono.page';

const routes: Routes = [
  {
    path: '',
    component: MiBonoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiBonoPageRoutingModule {}
