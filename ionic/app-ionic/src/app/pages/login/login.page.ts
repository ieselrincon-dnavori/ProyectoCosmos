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
    private userState: UserStateService
  ) {}

  login() {

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password)
      .subscribe({

        next: res => {

          this.loading = false;

          // 🔥 UNA sola llamada
          this.auth.saveSession(res.token, res.user);

          // cargar bono SOLO cliente
          if (res.user.rol === 'cliente') {
            this.userState.loadBono();
          }

          // navegación automática
          this.router.navigate(['/' + res.user.rol]);
        },

        error: err => {

          this.loading = false;

          this.errorMsg =
            err.status === 401
              ? 'Credenciales incorrectas'
              : 'Error de conexión con el servidor';
        }
      });
  }
}
