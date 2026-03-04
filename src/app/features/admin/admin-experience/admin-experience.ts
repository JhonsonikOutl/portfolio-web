import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExperienceService } from '../../../core/services/experience.service';
import { Experience } from '../../../shared/models/experience.model';

@Component({
  selector: 'app-admin-experience',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-experience.html',
  styleUrl: './admin-experience.css'
})
export class AdminExperience implements OnInit {
  experiences = signal<Experience[]>([]);
  loading = signal(true);
  
  // Confirm dialog
  showConfirmDialog = signal(false);
  experienceToDelete = signal<Experience | null>(null);

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  /**
   * Cargar lista de experiencias
   */
  loadExperiences(): void {
    this.loading.set(true);
    this.experienceService.getAll().subscribe({
      next: (experiences) => {
        // Ordenar por displayOrder
        const sorted = experiences.sort((a, b) => a.displayOrder - b.displayOrder);
        this.experiences.set(sorted);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar experiencias:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(experience: Experience): void {
    this.experienceToDelete.set(experience);
    this.showConfirmDialog.set(true);
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showConfirmDialog.set(false);
    this.experienceToDelete.set(null);
  }

  /**
   * Eliminar experiencia
   */
  deleteExperience(): void {
    const experience = this.experienceToDelete();
    if (!experience || !experience.id) return;

    this.experienceService.delete(experience.id).subscribe({
      next: () => {
        // Actualizar lista
        this.experiences.update(list => list.filter(e => e.id !== experience.id));
        this.showConfirmDialog.set(false);
        this.experienceToDelete.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar experiencia:', error);
        alert('Error al eliminar la experiencia');
      }
    });
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /**
   * Calcular duración
   */
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
}