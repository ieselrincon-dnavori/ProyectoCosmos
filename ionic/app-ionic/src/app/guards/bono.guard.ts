import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BonoService } from '../services/bono';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonoGuard implements CanActivate {

  constructor(
    private bonoService: BonoService,
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate() {

    const user = this.auth.getUser();

    if (!user) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.bonoService.getBonoActivo(user.id_usuario).pipe(

      map((bono:any) => {

        if (!bono) {
          // 🔥 NO navigate
          return this.router.createUrlTree(['/mi-bono']);
        }

        return true;
      }),

      catchError(() => {
        return of(this.router.createUrlTree(['/mi-bono']));
      })

    );
  }
}
