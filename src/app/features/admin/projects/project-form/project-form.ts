import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { CreateProject } from '../../../../shared/models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnInit {
  form!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);
  projectId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Detectar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.projectId.set(id);
      this.loadProject(id);
    }
  }

  /**
   * Cargar proyecto para editar
   */
  loadProject(id: string): void {
    this.loading.set(true);
    
    this.projectService.getById(id).subscribe({
      next: (project) => {
        // Convertir array de tecnologías a string
        const technologiesString = project.technologies.join(', ');
        
        // Formatear fechas para input type="date"
        const startDate = this.formatDateForInput(project.startDate);
        const endDate = project.endDate ? this.formatDateForInput(project.endDate) : '';
        
        // Llenar formulario
        this.form.patchValue({
          title: project.title,
          description: project.description,
          technologiesString: technologiesString,
          imageUrl: project.imageUrl || '',
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          startDate: startDate,
          endDate: endDate,
          isFeatured: project.isFeatured,
          displayOrder: project.displayOrder
        });
        
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al cargar el proyecto');
        console.error('Error loading project:', err);
      }
    });
  }

  /**
   * Formatear fecha para input type="date"
   */
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Inicializar formulario
   */
  initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      technologiesString: ['', Validators.required], // String separado por comas
      imageUrl: [''],
      githubUrl: [''],
      liveUrl: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      isFeatured: [false],
      displayOrder: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Guardar proyecto (crear o actualizar)
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Transformar datos del formulario
    const formValue = this.form.value;
    
    // Convertir string de tecnologías a array
    const technologies = formValue.technologiesString
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);

    const projectData: CreateProject = {
      title: formValue.title,
      description: formValue.description,
      technologies: technologies,
      imageUrl: formValue.imageUrl || undefined,
      githubUrl: formValue.githubUrl || undefined,
      liveUrl: formValue.liveUrl || undefined,
      startDate: formValue.startDate,
      endDate: formValue.endDate || undefined,
      isFeatured: formValue.isFeatured,
      displayOrder: formValue.displayOrder
    };

    if (this.isEditMode() && this.projectId()) {
      this.updateProject(this.projectId()!, projectData);
    } else {
      this.createProject(projectData);
    }
  }

  /**
   * Crear nuevo proyecto
   */
  private createProject(projectData: CreateProject): void {
    this.projectService.create(projectData).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al guardar el proyecto');
        console.error('Error creating project:', err);
      }
    });
  }

  /**
   * Actualizar proyecto existente
   */
  private updateProject(id: string, projectData: CreateProject): void {
    this.projectService.update(id, projectData).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al actualizar el proyecto');
        console.error('Error updating project:', err);
      }
    });
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtener mensaje de error de un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.errors['min']) {
      return `Valor mínimo: ${field.errors['min'].min}`;
    }

    return 'Campo inválido';
  }
}