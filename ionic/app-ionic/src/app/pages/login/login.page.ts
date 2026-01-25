import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
})
export class LoginPage {

  email = '';
  password = '';

  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: user => {
        this.loading = false;
        this.auth.saveUser(user);

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
