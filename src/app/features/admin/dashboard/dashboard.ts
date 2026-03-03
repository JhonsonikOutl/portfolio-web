import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  stats = signal<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0
  });

  user = signal<{ username: string } | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadStats();
  }

  private loadUser(): void {
    // Cargar usuario desde localStorage o servicio
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  private async loadStats(): Promise<void> {
    try {
      // Cargar estadísticas desde el backend
      const [projects, skills, experiences, messages] = await Promise.all([
        this.http.get<any[]>(`${environment.apiUrl}/projects`).toPromise(),
        this.http.get<any[]>(`${environment.apiUrl}/skills`).toPromise(),
        this.http.get<any[]>(`${environment.apiUrl}/experiences`).toPromise(),
        this.http.get<any[]>(`${environment.apiUrl}/contact`).toPromise()
      ]);

      this.stats.set({
        projects: projects?.length || 0,
        skills: skills?.length || 0,
        experiences: experiences?.length || 0,
        messages: messages?.length || 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }
}