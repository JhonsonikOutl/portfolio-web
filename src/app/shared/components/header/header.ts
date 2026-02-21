import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  mobileMenuOpen = false;
  isAdminRoute = false;
  isAuthenticated = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute = this.router.url.startsWith('/admin') && this.router.url !== '/admin/login';
        this.checkAuth();
      });
    
    // Check inicial
    this.isAdminRoute = this.router.url.startsWith('/admin') && this.router.url !== '/admin/login';
    this.checkAuth();
    
    // Suscribirse a cambios de autenticación
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated.set(auth);
    });
  }

  checkAuth() {
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.closeMenu();
    this.router.navigate(['/']);
  }
}