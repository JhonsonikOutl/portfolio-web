import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../../core/services/experience.service';

@Component({
  selector: 'app-experience-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-form.html',
  styleUrl: './experience-form.css'
})
export class ExperienceForm implements OnInit {
  experienceForm!: FormGroup;
  isEditMode = signal(false);
  experienceId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService,
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
      this.experienceId.set(id);
      this.loadExperience(id);
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.experienceForm = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      position: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrentJob: [false],
      achievements: this.fb.array([]),
      technologies: this.fb.array([]),
      displayOrder: [0, [Validators.min(0)]]
    });

    // Watch isCurrentJob para limpiar endDate
    this.experienceForm.get('isCurrentJob')?.valueChanges.subscribe(isCurrent => {
      if (isCurrent) {
        this.experienceForm.get('endDate')?.setValue('');
        this.experienceForm.get('endDate')?.clearValidators();
      } else {
        this.experienceForm.get('endDate')?.setValidators([Validators.required]);
      }
      this.experienceForm.get('endDate')?.updateValueAndValidity();
    });
  }

  /**
   * Cargar experiencia para editar
   */
  loadExperience(id: string): void {
    this.loading.set(true);
    this.experienceService.getById(id).subscribe({
      next: (experience) => {
        // Convertir fechas a formato YYYY-MM-DD para input date
        const startDate = new Date(experience.startDate).toISOString().split('T')[0];
        const endDate = experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '';

        this.experienceForm.patchValue({
          company: experience.company,
          position: experience.position,
          description: experience.description,
          startDate: startDate,
          endDate: endDate,
          isCurrentJob: experience.isCurrentJob,
          displayOrder: experience.displayOrder || 0
        });

        // Cargar achievements
        this.achievementsArray.clear();
        experience.achievements?.forEach(achievement => {
          this.achievementsArray.push(this.fb.control(achievement, [Validators.required, Validators.minLength(5)]));
        });

        // Cargar technologies
        this.technologiesArray.clear();
        experience.technologies?.forEach(tech => {
          this.technologiesArray.push(this.fb.control(tech, [Validators.required, Validators.minLength(1)]));
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar experiencia:', error);
        alert('Error al cargar la experiencia');
        this.router.navigate(['/admin/experience']);
        this.loading.set(false);
      }
    });
  }

  /**
   * Guardar experiencia (crear o actualizar)
   */
  onSubmit(): void {
    if (this.experienceForm.invalid) {
      this.markFormGroupTouched(this.experienceForm);
      return;
    }

    this.saving.set(true);

    const formValue = this.experienceForm.value;
    const dto = {
      company: formValue.company,
      position: formValue.position,
      description: formValue.description,
      startDate: formValue.startDate,
      endDate: formValue.isCurrentJob ? undefined : formValue.endDate,
      isCurrentJob: formValue.isCurrentJob,
      achievements: this.achievementsArray.value.filter((a: string) => a.trim() !== ''),
      technologies: this.technologiesArray.value.filter((t: string) => t.trim() !== ''),
      displayOrder: formValue.displayOrder || 0
    };

    if (this.isEditMode() && this.experienceId()) {
      // Actualizar
      this.experienceService.update(this.experienceId()!, dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/experience']);
        },
        error: (error) => {
          console.error('Error al actualizar experiencia:', error);
          alert('Error al guardar la experiencia');
          this.saving.set(false);
        }
      });
    } else {
      // Crear
      this.experienceService.create(dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/experience']);
        },
        error: (error) => {
          console.error('Error al crear experiencia:', error);
          alert('Error al guardar la experiencia');
          this.saving.set(false);
        }
      });
    }
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    this.router.navigate(['/admin/experience']);
  }

  /**
   * Obtener FormArray de achievements
   */
  get achievementsArray(): FormArray {
    return this.experienceForm.get('achievements') as FormArray;
  }

  /**
   * Obtener FormArray de technologies
   */
  get technologiesArray(): FormArray {
    return this.experienceForm.get('technologies') as FormArray;
  }

  /**
   * Agregar achievement
   */
  addAchievement(): void {
    this.achievementsArray.push(
      this.fb.control('', [Validators.required, Validators.minLength(5)])
    );
  }

  /**
   * Eliminar achievement
   */
  removeAchievement(index: number): void {
    this.achievementsArray.removeAt(index);
  }

  /**
   * Agregar technology
   */
  addTechnology(): void {
    this.technologiesArray.push(
      this.fb.control('', [Validators.required, Validators.minLength(1)])
    );
  }

  /**
   * Eliminar technology
   */
  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  /**
   * Marcar todos los campos como touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(c => c.markAsTouched());
      }
    });
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.experienceForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtener mensaje de error
   */
  getErrorMessage(fieldName: string): string {
    const field = this.experienceForm.get(fieldName);
    
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
    
    return '';
  }

  /**
   * Verificar si un control de array tiene error
   */
  hasArrayControlError(index: number, arrayName: string): boolean {
    const array = this.experienceForm.get(arrayName) as FormArray;
    const control = array.at(index);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtener el valor de isCurrentJob
   */
  get isCurrentJob(): boolean {
    return this.experienceForm.get('isCurrentJob')?.value || false;
  }
}