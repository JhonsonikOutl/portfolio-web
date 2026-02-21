import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialog],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class AdminProjects implements OnInit {
  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Modal de confirmación
  showDeleteModal = signal(false);
  projectToDelete = signal<Project | null>(null);
  deleteSuccess = signal<string | null>(null);

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Cargar proyectos desde el backend
   */
  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar proyectos');
        this.loading.set(false);
        console.error('Error loading projects:', err);
      }
    });
  }

  /**
   * Abrir modal de confirmación para eliminar
   */
  deleteProject(project: Project): void {
    this.projectToDelete.set(project);
    this.showDeleteModal.set(true);
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(): void {
    const project = this.projectToDelete();
    if (!project || !project.id) return;

    this.projectService.delete(project.id).subscribe({
      next: () => {
        // Remover de la lista
        this.projects.set(
          this.projects().filter(p => p.id !== project.id)
        );

        // Cerrar modal
        this.showDeleteModal.set(false);
        this.projectToDelete.set(null);

        // Mostrar mensaje de éxito
        this.deleteSuccess.set(`Proyecto "${project.title}" eliminado correctamente`);

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.deleteSuccess.set(null);
        }, 3000);
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.error.set('Error al eliminar el proyecto');
        this.showDeleteModal.set(false);
      }
    });
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.projectToDelete.set(null);
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short'
    });
  }

  /**
   * Obtener las primeras 3 tecnologías
   */
  getTechnologiesPreview(technologies: string[]): string {
    if (!technologies || technologies.length === 0) return '-';
    return technologies.slice(0, 3).join(', ');
  }

  /**
   * Obtener icono según la primera tecnología
   */
  getTechnologyIcon(technologies: string[]): string {
    if (!technologies || technologies.length === 0) return '📁';

    const tech = technologies[0].toLowerCase();
    const icons: Record<string, string> = {
      'angular': '🅰️',
      'react': '⚛️',
      'vue': '💚',
      'nodejs': '🟢',
      'dotnet': '🔵',
      '.net': '🔵',
      'csharp': '🔵',
      'python': '🐍',
      'java': '☕',
      'typescript': '📘',
      'javascript': '📜'
    };

    for (const [key, icon] of Object.entries(icons)) {
      if (tech.includes(key)) return icon;
    }

    return '🔧';
  }

  get deleteMessage(): string {
    const title = this.projectToDelete()?.title ?? '';
    return `¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`;
  }
}