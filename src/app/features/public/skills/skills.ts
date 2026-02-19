import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillService } from '../../../core/services/skill.service';
import { Skill } from '../../../shared/models/skill.model';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit {
  skills = signal<Skill[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private skillService: SkillService) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCategories();
  }

  loadSkills(): void {
    this.skillService.getAll().subscribe({
      next: (data) => {
        // Ordenar por displayOrder
        const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
        this.skills.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las habilidades');
        this.loading.set(false);
        console.error('Error loading skills:', err);
      }
    });
  }

  loadCategories(): void {
    this.skillService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  getFilteredSkills(): Skill[] {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.skills();
    }
    return this.skills().filter(s => s.category === category);
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills().filter(s => s.category === category);
  }

  getLevelLabel(level: number): string {
    if (level >= 90) return 'Experto';
    if (level >= 75) return 'Avanzado';
    if (level >= 50) return 'Intermedio';
    return 'Básico';
  }

  getLevelColor(level: number): string {
    if (level >= 90) return '#10b981';
    if (level >= 75) return '#3b82f6';
    if (level >= 50) return '#f59e0b';
    return '#6366f1';
  }
}