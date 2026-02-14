import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  email = '';
  password = '';

  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private userState: UserStateService  // 🔥 Añadido
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: user => {
        this.loading = false;
        this.auth.saveUser(user);

        // 🔥 SOLUCIÓN: Cargar el bono ANTES de navegar si es cliente
        if (user.rol === 'cliente') {
          this.userState.loadBono();
        }

        // Navegar según el rol
        switch (user.rol) {
          case 'cliente':
            this.router.navigate(['/cliente']);
            break;
          case 'profesor':
            this.router.navigate(['/profesor']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          default:
            this.router.navigate(['/home']);
        }
      },
      error: err => {
        this.loading = false;

        if (err.status === 401) {
          this.errorMsg = 'Credenciales incorrectas';
        } else {
          this.errorMsg = 'Error de conexión con el servidor';
        }
      }
    });
  }
}