import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    const user = this.auth.getUser();
    if (!user) return;

    if (user.rol === 'cliente') {
      this.menuItems = [
        { title: 'Inicio', url: '/cliente', icon: 'home-outline' },
        { title: 'Horarios', url: '/horarios', icon: 'calendar-outline' },
        { title: 'Mis reservas', url: '/cliente', icon: 'bookmark-outline' },
      ];
    }

    if (user.rol === 'profesor') {
      this.menuItems = [
        { title: 'Mis clases', url: '/profesor', icon: 'fitness-outline' },
        { title: 'Horarios', url: '/horarios', icon: 'calendar-outline' },
      ];
    }

    if (user.rol === 'admin') {
      this.menuItems = [
        { title: 'Usuarios', url: '/admin', icon: 'people-outline' },
        { title: 'Clases', url: '/admin', icon: 'barbell-outline' },
        { title: 'Pagos', url: '/admin', icon: 'card-outline' },
      ];
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
