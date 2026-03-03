import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../src/app/shared/components/header/header';
import { Footer } from '../../src/app/shared/components/footer/footer';
import { SessionWarningModalComponent } from './shared/components/session-warning-modal/session-warning-modal';
import { SessionTimeoutService } from '../../src/app/core/services/sessionTimeout.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SessionWarningModalComponent],
  template: `
    <div data-theme="dark">
      <app-header />
      <main class="min-h-screen">
        <router-outlet />
      </main>
      <app-footer />
      <app-session-warning-modal />
    </div>
  `
})
export class App implements OnInit {
  title = 'portfolio-web';
  
  private sessionTimeoutService = inject(SessionTimeoutService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Verificar si el usuario está autenticado al iniciar
    if (this.authService.isAuthenticated()) {
      console.log('✅ Usuario autenticado, iniciando monitoreo de sesión');
      this.sessionTimeoutService.startMonitoring();
    }

    // Suscribirse a cambios de autenticación
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        console.log('✅ Login detectado, iniciando monitoreo de sesión');
        this.sessionTimeoutService.startMonitoring();
      } else {
        console.log('❌ Logout detectado, deteniendo monitoreo de sesión');
        this.sessionTimeoutService.stopMonitoring();
      }
    });
  }
}