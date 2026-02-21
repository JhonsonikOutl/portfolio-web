import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  user = signal<AuthResponse | null>(null);
  showMobileMenu = signal(false);
  isAuthenticated = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user.set(userData);
    }

    this.checkAuth();

    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated.set(auth);
    });
  }

  checkAuth(): void {
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.set(!this.showMobileMenu());
  }
}