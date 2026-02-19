import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const user = this.auth.getUser();

    // NO LOGIN
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    // ROL NO PERMITIDO
    if (allowedRoles && !allowedRoles.includes(user.rol)) {

      // redirección segura
      switch(user.rol){

        case 'cliente':
          this.router.navigate(['/cliente']);
          break;

        case 'profesor':
          this.router.navigate(['/profesor']);
          break;

        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;

        default:
          this.router.navigate(['/login']);
      }

      return false;
    }

    return true;
  }
}
