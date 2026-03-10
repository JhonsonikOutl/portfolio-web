import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly storageKey = 'portfolio-theme';

  private readonly _theme = signal<Theme>(this.loadSavedTheme());

  readonly currentTheme = this._theme.asReadonly();

  constructor() {

    effect(() => {
      const theme = this._theme();

      localStorage.setItem(this.storageKey, theme);
      this.applyTheme(theme);

    });

  }

  toggleTheme(): void {
    this._theme.update(theme => theme === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  isDark(): boolean {
    return this._theme() === 'dark';
  }

  isLight(): boolean {
    return this._theme() === 'light';
  }

  private loadSavedTheme(): Theme {
    const saved = localStorage.getItem(this.storageKey);

    return saved === 'light' ? 'light' : 'dark';
  }

  private applyTheme(theme: Theme): void {

    const html = document.documentElement;

    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }

  }
}