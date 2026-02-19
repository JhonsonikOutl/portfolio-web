import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project.model';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projects = signal<Project[]>([]);
  filteredProjects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedCategory = signal<string>('all');

  categories = [
    { id: 'all', label: 'Todos' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'api', label: 'API/Backend' }
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        // Ordenar por displayOrder
        const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
        this.projects.set(sorted);
        this.filteredProjects.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los proyectos');
        this.loading.set(false);
        console.error('Error loading projects:', err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
    
    if (category === 'all') {
      this.filteredProjects.set(this.projects());
    } else {
      const filtered = this.projects().filter(p => 
        p.technologies.some(tech => 
          tech.toLowerCase().includes(category.toLowerCase())
        )
      );
      this.filteredProjects.set(filtered);
    }
  }

  hasLiveDemo(project: Project): boolean {
    return !!project.liveUrl;
  }

  hasGitHub(project: Project): boolean {
    return !!project.githubUrl;
  }

  getProjectDuration(project: Project): string {
    const start = new Date(project.startDate);
    const end = project.endDate ? new Date(project.endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 1) return '< 1 mes';
    if (months === 1) return '1 mes';
    if (months < 12) return `${months} meses`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
    return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
  }
}