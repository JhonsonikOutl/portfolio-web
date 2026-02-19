import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService } from '../../../core/services/experience.service';
import { Experience } from '../../../shared/models/experience.model';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experiences implements OnInit {
  experiences = signal<Experience[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.experienceService.getAll().subscribe({
      next: (data) => {
        // Ordenar por displayOrder
        const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
        this.experiences.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar la experiencia');
        this.loading.set(false);
        console.error('Error loading experience:', err);
      }
    });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getDuration(startDate: Date | string, endDate?: Date | string): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 1) return '< 1 mes';
    if (months === 1) return '1 mes';
    if (months < 12) return `${months} meses`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
    return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
  }

  getCurrentJobsCount(): number {
    return this.experiences().filter(e => e.isCurrentJob).length;
  }

  getCurrentJobsLabel(): string {
    const count = this.getCurrentJobsCount();
    return count === 1 ? 'Posición Actual' : 'Posiciones Actuales';
  }
}