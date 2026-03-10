import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../src/app/shared/components/header/header';
import { Footer } from '../../src/app/shared/components/footer/footer';
import { SessionWarningModalComponent } from './shared/components/session-warning-modal/session-warning-modal';
import { SessionTimeoutService } from '../../src/app/core/services/sessionTimeout.service';
import { AuthService } from './core/services/auth.service';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SessionWarningModalComponent, ToastContainerComponent],
  template: `
    <div>
      <app-header />
      <main class="min-h-screen">
        <router-outlet />
        <app-toast-container />
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
    if (this.authService.isAuthenticated()) {
      console.log('✅ Usuario autenticado, iniciando monitoreo de sesión');
      this.sessionTimeoutService.startMonitoring();
    }

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