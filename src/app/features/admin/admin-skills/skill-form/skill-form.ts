import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillService } from '../../../../core/services/skill.service';

@Component({
  selector: 'app-skill-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css'
})
export class SkillForm implements OnInit {
  skillForm!: FormGroup;
  isEditMode = signal(false);
  skillId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  // Categorías predefinidas
  categories = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Tools',
    'Soft Skills',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.skillId.set(id);
      this.loadSkill(id);
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      level: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      category: ['', Validators.required],
      icon: [''],
      displayOrder: [0, [Validators.min(0)]]
    });
  }

  /**
   * Cargar skill para editar
   */
  loadSkill(id: string): void {
    this.loading.set(true);
    this.skillService.getById(id).subscribe({
      next: (skill) => {
        this.skillForm.patchValue({
          name: skill.name,
          level: skill.level,
          category: skill.category,
          icon: skill.icon || '',
          displayOrder: skill.displayOrder || 0
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar skill:', error);
        alert('Error al cargar la habilidad');
        this.router.navigate(['/admin/skills']);
        this.loading.set(false);
      }
    });
  }

  /**
   * Guardar skill (crear o actualizar)
   */
  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.markFormGroupTouched(this.skillForm);
      return;
    }

    this.saving.set(true);

    const formValue = this.skillForm.value;
    const dto = {
      name: formValue.name,
      level: formValue.level,
      category: formValue.category,
      icon: formValue.icon || undefined,
      displayOrder: formValue.displayOrder || 0
    };

    if (this.isEditMode() && this.skillId()) {
      // Actualizar
      this.skillService.update(this.skillId()!, dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/skills']);
        },
        error: (error) => {
          console.error('Error al actualizar skill:', error);
          alert('Error al guardar la habilidad');
          this.saving.set(false);
        }
      });
    } else {
      // Crear
      this.skillService.create(dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/skills']);
        },
        error: (error) => {
          console.error('Error al crear skill:', error);
          alert('Error al guardar la habilidad');
          this.saving.set(false);
        }
      });
    }
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    this.router.navigate(['/admin/skills']);
  }

  /**
   * Marcar todos los campos como touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.skillForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtener mensaje de error
   */
  getErrorMessage(fieldName: string): string {
    const field = this.skillForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `El valor mínimo es ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `El valor máximo es ${field.errors?.['max'].max}`;
    }
    
    return '';
  }

  /**
   * Obtener valor actual del nivel para preview
   */
  get currentLevel(): number {
    return this.skillForm.get('level')?.value || 0;
  }
}