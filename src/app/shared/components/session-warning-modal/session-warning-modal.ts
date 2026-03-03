import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionTimeoutService } from '../../../core/services/sessionTimeout.service';

@Component({
  selector: 'app-session-warning-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-warning-modal.html',
  styleUrl: './session-warning-modal.css'
})

export class SessionWarningModalComponent {
  sessionTimeoutService = inject(SessionTimeoutService);

  /**
   * Usuario hace click en "Seguir Conectado"
   */
  continueSession(): void {
    this.sessionTimeoutService.renewSession();
  }

  /**
   * Formatea segundos a MM:SS
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
