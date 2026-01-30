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

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      // Redirigir a su panel correcto
      this.router.navigate(['/' + user.rol]);
      return false;
    }

    return true;
  }
}
