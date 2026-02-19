import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div data-theme="dark">
      <app-header />
      <main class="min-h-screen">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class App {
  title = 'portfolio-web';
}