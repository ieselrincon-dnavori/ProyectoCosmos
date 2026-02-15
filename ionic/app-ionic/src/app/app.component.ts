import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserStateService } from './services/user-state.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  // 🔥 observable del bono
  bono$: Observable<any>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private userState: UserStateService
  ) {
    this.bono$ = this.userState.bono$;
  }

  ngOnInit() {
    // 🔥 SOLUCIÓN 1: Detectar cada navegación para actualizar el menú
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initializeMenu();
      });

    // 🔥 SOLUCIÓN 2: Inicializar inmediatamente si ya hay usuario
    this.initializeMenu();

    // 🔥 SOLUCIÓN 3: Reaccionar a cambios en el bono
    this.userState.bono$.subscribe(() => {
      this.initializeMenu();
    });
  }

  /**
   * 🔥 Inicializa el menú basándose en el usuario actual
   */
  initializeMenu() {
    const user = this.auth.getUser();
    
    if (!user) {
      this.menuItems = [];
      return;
    }

    // Si es cliente, cargar el bono para determinar el menú
    if (user.rol === 'cliente') {
      this.userState.loadBono();
      
      // Obtener el estado actual del bono (síncrono)
      const bonoActual = this.userState.getBonoActual();
      this.loadMenu(!!bonoActual);
    } else {
      // Para profesor y admin, cargar menú directamente
      this.loadMenu(false);
    }
  }

  loadMenu(tieneBono: boolean) {
    const user = this.auth.getUser();
    if (!user) return;

    if (user.rol === 'cliente') {
      this.menuItems = [
        { title: 'Inicio', url: '/cliente', icon: 'home-outline' },
        { title: 'Mis reservas', url: '/cliente', icon: 'bookmark-outline' },
        { title: 'Mi bono', url: '/mi-bono', icon: 'card-outline' },
      ];

      // 🔥 SOLO si tiene bono activo
      if (tieneBono) {
        this.menuItems.splice(1, 0, {
          title: 'Horarios',
          url: '/horarios',
          icon: 'calendar-outline'
        });
      }
    }

    if (user.rol === 'profesor') {
      this.menuItems = [
        { title: 'Mis clases', url: '/profesor', icon: 'fitness-outline' },
        { title: 'Horarios', url: '/horarios', icon: 'calendar-outline' },
      ];
    }

    if (user.rol === 'admin') {
  this.menuItems = [
    { title: 'Dashboard', url: '/admin', icon: 'analytics-outline' },

    { title: 'Usuarios', url: '/admin', icon: 'people-outline' },

    { title: 'Clases', url: '/admin-clases', icon: 'barbell-outline' },

    // 🔥 NUEVO
    { title: 'Crear clase', url: '/admin-crear-clase', icon: 'add-circle-outline' },

    { title: 'Pagos', url: '/admin-pagos', icon: 'card-outline' },
  ];
}

  }

  logout() {
    this.userState.clear();
    this.auth.logout();
    this.menuItems = []; // 🔥 Limpiar menú al salir
    this.router.navigate(['/login']);
  }
}