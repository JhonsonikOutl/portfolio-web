import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user = signal<AuthResponse | null>(null);
  showMobileMenu = signal(false);

  stats = signal({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user.set(userData);
    }

    this.stats.set({
      projects: 5,
      skills: 12,
      experiences: 3,
      messages: 8
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  /**
   * Toggle menú móvil
   */
  toggleMobileMenu(): void {
    this.showMobileMenu.set(!this.showMobileMenu());
  }
}