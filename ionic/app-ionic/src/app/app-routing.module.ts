import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { BonoGuard } from './guards/bono.guard';



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
  canActivate: [AuthGuard, BonoGuard],
  data: { roles: ['cliente', 'profesor', 'admin'] }
},

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'alumnos-modal',
    loadChildren: () => import('./pages/alumnos-modal/alumnos-modal.module').then( m => m.AlumnosModalPageModule)
  },
  {
    path: 'admin-crear-usuario',
    loadChildren: () => import('./pages/admin-crear-usuario/admin-crear-usuario.module')
    .then( m => m.AdminCrearUsuarioPageModule)
  },
  {
    path: 'bonos',
    loadChildren: () => import('./pages/bonos/bonos.module').then( m => m.BonosPageModule)
  },
  {
    path: 'comprar-bono',
    loadChildren: () => import('./pages/comprar-bono/comprar-bono.module').then( m => m.ComprarBonoPageModule)
  },
  {
    path: 'mi-bono',
    loadChildren: () => import('./pages/mi-bono/mi-bono.module').then( m => m.MiBonoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
