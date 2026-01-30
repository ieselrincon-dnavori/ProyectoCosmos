import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';



const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },

  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClientePageModule),
    canActivate: [AuthGuard],
    data: { roles: ['cliente'] }
  },

  {
    path: 'profesor',
    loadChildren: () => import('./pages/profesor/profesor.module').then(m => m.ProfesorPageModule),
    canActivate: [AuthGuard],
    data: { roles: ['profesor'] }
  },

  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'horarios',
    loadChildren: () => import('./pages/horarios/horarios.module').then(m => m.HorariosPageModule),
    canActivate: [AuthGuard],
    data: { roles: ['cliente', 'profesor', 'admin'] } // accesible para todos
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
