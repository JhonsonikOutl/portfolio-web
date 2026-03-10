import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);

  stats = signal<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0
  });

  user = signal<{ username: string } | null>(null);

  ngOnInit(): void {
    this.loadUser();
    this.loadStats();
  }

  private loadUser(): void {
    const raw = localStorage.getItem('auth_user');

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      if (parsed?.username) {
        this.user.set({ username: parsed.username });
      }
    } catch {
      console.error('Error al parsear datos del usuario');
    }
  }

  private async loadStats(): Promise<void> {
    try {

      const [projects, skills, experiences, messages] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/projects`)),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/skills`)),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/experiences`)),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/contact`))
      ]);

      this.stats.set({
        projects: projects?.length ?? 0,
        skills: skills?.length ?? 0,
        experiences: experiences?.length ?? 0,
        messages: messages?.length ?? 0
      });

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }
}