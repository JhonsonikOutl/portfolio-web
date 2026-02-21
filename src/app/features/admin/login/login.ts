import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  // Signals - Estado reactivo de Angular
  username = signal('');        // Username ingresado por el usuario
  password = signal('');        // Contraseña ingresada
  loading = signal(false);      // Indica si está procesando el login
  error = signal<string | null>(null);  // Mensaje de error si falla

  constructor(
    private authService: AuthService,  // Servicio que maneja la autenticación
    private router: Router              // Para redirigir después del login
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  /**
   * Se ejecuta cuando el usuario envía el formulario
   */
  onSubmit(): void {
    // Validación básica
    if (!this.username() || !this.password()) {
      this.error.set('Usuario y contraseña son requeridos');
      return;
    }

    // Iniciar proceso de login
    this.loading.set(true);
    this.error.set(null);

    // Preparar credenciales como objeto
    const credentials = {
      username: this.username(),
      password: this.password()
    };

    // Llamar al servicio de autenticación
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Login exitoso
        this.loading.set(false);
        // Redirigir al dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // Login fallido
        this.loading.set(false);
        this.error.set('Usuario o contraseña incorrectos');
        console.error('Login error:', err);
      }
    });
  }
}