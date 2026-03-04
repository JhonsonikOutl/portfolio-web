import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkillService } from '../../../core/services/skill.service';
import { Skill } from '../../../shared/models/skill.model';

@Component({
  selector: 'app-admin-skills',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-skills.html',
  styleUrl: './admin-skills.css'
})
export class AdminSkills implements OnInit {
  skills = signal<Skill[]>([]);
  loading = signal(true);
  
  // Confirm dialog
  showConfirmDialog = signal(false);
  skillToDelete = signal<Skill | null>(null);

  constructor(private skillService: SkillService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  /**
   * Cargar lista de skills
   */
  loadSkills(): void {
    this.loading.set(true);
    this.skillService.getAll().subscribe({
      next: (skills) => {
        this.skills.set(skills);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar skills:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(skill: Skill): void {
    this.skillToDelete.set(skill);
    this.showConfirmDialog.set(true);
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showConfirmDialog.set(false);
    this.skillToDelete.set(null);
  }

  /**
   * Eliminar skill
   */
  deleteSkill(): void {
    const skill = this.skillToDelete();
    if (!skill || !skill.id) return;

    this.skillService.delete(skill.id).subscribe({
      next: () => {
        // Actualizar lista
        this.skills.update(list => list.filter(s => s.id !== skill.id));
        this.showConfirmDialog.set(false);
        this.skillToDelete.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar skill:', error);
        alert('Error al eliminar la habilidad');
      }
    });
  }

  /**
   * Agrupar skills por categoría
   */
  getSkillsByCategory(category: string): Skill[] {
    return this.skills().filter(s => s.category === category);
  }

  /**
   * Obtener categorías únicas
   */
  getCategories(): string[] {
    const categories = this.skills().map(s => s.category);
    return [...new Set(categories)].sort();
  }

  /**
   * Obtener iniciales de un nombre (máximo 2 letras)
   */
  getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    
    if (words.length >= 2) {
      // Tomar primera letra de las dos primeras palabras
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      // Tomar las primeras 2 letras de la única palabra
      return name.substring(0, 2).toUpperCase();
    }
  }

  /**
   * Verificar si el icono existe y no está vacío
   */
  hasIcon(icon?: string): boolean {
    return !!icon && icon.trim() !== '';
  }
}