import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, fromEvent, merge, firstValueFrom } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionSettings } from '../../shared/models/session-settings.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private apiUrl = `${environment.apiUrl}/settings/session`;
  
  // Señales para estado reactivo
  showWarning = signal(false);
  remainingSeconds = signal(0);
  
  // Configuración de sesión
  private settings: SessionSettings | null = null;
  private inactivityTimer: any;
  private warningTimer: any;
  private countdownTimer: any;
  
  // Subject para destruir observables
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicia el monitoreo de sesión
   */
  async startMonitoring(): Promise<void> {
    // Obtener configuración desde el backend
    await this.loadSettings();

    if (!this.settings || !this.settings.isEnabled) {
      console.log('Session timeout deshabilitado');
      return;
    }

    console.log('🔐 Session timeout iniciado:', this.settings);

    // Escuchar actividad del usuario
    this.setupActivityListeners();
    
    // Iniciar timer de inactividad
    this.resetInactivityTimer();
  }

  /**
   * Detiene el monitoreo de sesión
   */
  stopMonitoring(): void {
    this.clearAllTimers();
    this.destroy$.next();
    this.destroy$.complete();
    this.showWarning.set(false);
  }

  /**
   * Renueva la sesión (llamado cuando el usuario interactúa)
   */
  renewSession(): void {
    if (this.showWarning()) {
      this.hideWarning();
    }
    this.resetInactivityTimer();
  }

  /**
   * Carga la configuración desde el backend
   */
  private async loadSettings(): Promise<void> {
    try {
      this.settings = await firstValueFrom(this.http.get<SessionSettings>(this.apiUrl));
    } catch (error) {
      console.error('Error al cargar configuración de sesión:', error);
      this.settings = {
        inactivityTimeoutMinutes: 15,
        warningBeforeTimeoutMinutes: 1,
        isEnabled: true
      };
    }
  }

  /**
   * Configura los listeners de actividad del usuario
   */
  private setupActivityListeners(): void {
    // Eventos de actividad
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Merge de todos los eventos
    const activity$ = merge(
      ...events.map(event => fromEvent(document, event))
    );

    // Detectar actividad con debounce para no resetear en cada pixel
    activity$
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.renewSession();
      });
  }

  /**
   * Resetea el timer de inactividad
   */
  private resetInactivityTimer(): void {
    if (!this.settings) return;

    this.clearAllTimers();

    const timeoutMs = this.settings.inactivityTimeoutMinutes * 60 * 1000;
    const warningMs = (this.settings.inactivityTimeoutMinutes - this.settings.warningBeforeTimeoutMinutes) * 60 * 1000;

    // Timer para mostrar advertencia
    this.warningTimer = setTimeout(() => {
      this.displayWarning();
    }, warningMs);

    // Timer para cerrar sesión
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, timeoutMs);
  }

  /**
   * Muestra la advertencia de timeout
   */
  private displayWarning(): void {
    if (!this.settings) return;

    console.warn('⚠️ Advertencia de timeout de sesión');
    this.showWarning.set(true);

    const warningSeconds = this.settings.warningBeforeTimeoutMinutes * 60;
    this.remainingSeconds.set(warningSeconds);

    this.countdownTimer = setInterval(() => {
      const remaining = this.remainingSeconds() - 1;
      this.remainingSeconds.set(remaining);

      if (remaining <= 0) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  /**
   * Oculta la advertencia
   */
  private hideWarning(): void {
    this.showWarning.set(false);
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  /**
   * Cierra la sesión automáticamente
   */
  private logout(): void {
    console.log('⏱️ Sesión cerrada por inactividad');
    this.stopMonitoring();
    this.authService.logout();
    this.router.navigate(['/admin/login'], {
      queryParams: { reason: 'timeout' }
    });
  }

  /**
   * Limpia todos los timers
   */
  private clearAllTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
}