import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserStateService } from './services/user-state.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { take } from 'rxjs/operators';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {

  menuItems: MenuItem[] = [];
  bono$: Observable<any>;

  constructor(
    public auth: AuthService, // 👈 PUBLIC (para template)
    private router: Router,
    private userState: UserStateService,
    private menu: MenuController
  ) {
    this.bono$ = this.userState.bono$;
  }

  ngOnInit() {

    // 🔥 SOLO UNA SUBSCRIPTION GLOBAL
    this.userState.bono$
      .pipe(take(1))
      .subscribe(bono => {
        this.buildMenu(!!bono);
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const user = this.auth.getUser();

        if (!user) {
          this.menuItems = [];
          return;
        }

        // cargar bono SOLO una vez
        if (user.rol === 'cliente') {
          this.userState.loadBono();
        } else {
          this.buildMenu(false);
        }
      });

    // primera carga
    const user = this.auth.getUser();
    if (user?.rol === 'cliente') {
      this.userState.loadBono();
    }
  }

  buildMenu(tieneBono: boolean) {

    const user = this.auth.getUser();
    if (!user) return;

    /* CLIENTE */

    if (user.rol === 'cliente') {

      this.menuItems = [
        { title: 'Inicio', url: '/cliente', icon: 'home-outline' },
        { title: 'Mis reservas', url: '/cliente', icon: 'bookmark-outline' },
        { title: 'Mi bono', url: '/mi-bono', icon: 'card-outline' },
      ];

      if (tieneBono) {
        this.menuItems.splice(1, 0, {
          title: 'Horarios',
          url: '/horarios',
          icon: 'calendar-outline'
        });
      }
    }

    /* PROFESOR */

    if (user.rol === 'profesor') {
      this.menuItems = [
        { title: 'Mis clases', url: '/profesor', icon: 'fitness-outline' },
        { title: 'Horarios', url: '/horarios', icon: 'calendar-outline' },
      ];
    }

    /* ADMIN */

    if (user.rol === 'admin') {

      this.menuItems = [
        { title: 'Dashboard', url: '/admin-dashboard', icon: 'analytics-outline' },
        { title: 'Usuarios', url: '/admin', icon: 'people-outline' },
        { title: 'Clases', url: '/admin-clases', icon: 'barbell-outline' },
        { title: 'Crear clase', url: '/admin-crear-clase', icon: 'add-circle-outline' },
        { title: 'Pagos', url: '/admin-pagos', icon: 'card-outline' },
      ];
    }
  }

  closeMenu() {
    this.menu.close();
  }

  logout() {

  this.menu.close();

  this.userState.clear();

  this.auth.logout();

  this.menuItems = [];

  // 🔥 HARD RESET DE ANGULAR
  window.location.href = '/login';

}

}
