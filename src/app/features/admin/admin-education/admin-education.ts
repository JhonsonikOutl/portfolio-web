import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EducationService } from '../../../core/services/education.service';
import { Education } from '../../../shared/models/education.model';

@Component({
  selector: 'app-admin-education',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-education.html',
  styleUrl: './admin-education.css'
})
export class AdminEducation implements OnInit {
  educations = signal<Education[]>([]);
  loading = signal(true);
  
  // Confirm dialog
  showConfirmDialog = signal(false);
  educationToDelete = signal<Education | null>(null);

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.loadEducations();
  }

  /**
   * Cargar lista de educaciones
   */
  loadEducations(): void {
    this.loading.set(true);
    this.educationService.getAll().subscribe({
      next: (educations) => {
        // Ordenar por displayOrder
        const sorted = educations.sort((a, b) => a.displayOrder - b.displayOrder);
        this.educations.set(sorted);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar educación:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(education: Education): void {
    this.educationToDelete.set(education);
    this.showConfirmDialog.set(true);
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showConfirmDialog.set(false);
    this.educationToDelete.set(null);
  }

  /**
   * Eliminar educación
   */
  deleteEducation(): void {
    const education = this.educationToDelete();
    if (!education || !education.id) return;

    this.educationService.delete(education.id).subscribe({
      next: () => {
        // Actualizar lista
        this.educations.update(list => list.filter(e => e.id !== education.id));
        this.showConfirmDialog.set(false);
        this.educationToDelete.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar educación:', error);
        alert('Error al eliminar la educación');
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