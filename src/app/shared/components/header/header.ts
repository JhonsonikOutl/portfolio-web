import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ProfileService } from '../../../core/services/profile.service';
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
  isHomePage = signal(true);
  isAuthenticated = signal(false);
  avatarUrl = signal<string | null>(null);

  readonly themeService = inject(ThemeService);
  private profileService = inject(ProfileService);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute = this.router.url.startsWith('/admin') && this.router.url !== '/admin/login';
        this.isHomePage.set(this.router.url === '/' || this.router.url === '');
        this.checkAuth();
      });

    this.isAdminRoute = this.router.url.startsWith('/admin') && this.router.url !== '/admin/login';
    this.isHomePage.set(this.router.url === '/' || this.router.url === '');
    this.checkAuth();

    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated.set(auth);
    });

    this.profileService.getProfile().subscribe({
      next: profile => this.avatarUrl.set(profile?.photoUrl || null),
      error: () => this.avatarUrl.set(null)
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