import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EducationService } from '../../../../core/services/education.service';

@Component({
  selector: 'app-education-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education-form.html',
  styleUrl: './education-form.css'
})
export class EducationForm implements OnInit {
  educationForm!: FormGroup;
  isEditMode = signal(false);
  educationId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private educationService: EducationService,
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
      this.educationId.set(id);
      this.loadEducation(id);
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.educationForm = this.fb.group({
      institution: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      degree: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      fieldOfStudy: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrentlyStudying: [false],
      description: ['', [Validators.maxLength(1000)]],
      displayOrder: [0, [Validators.min(0)]]
    });

    // Watch isCurrentlyStudying para limpiar endDate
    this.educationForm.get('isCurrentlyStudying')?.valueChanges.subscribe(isCurrent => {
      const endDateControl = this.educationForm.get('endDate');
      
      if (isCurrent) {
        endDateControl?.disable();
        endDateControl?.setValue('');
        endDateControl?.clearValidators();
      } else {
        endDateControl?.enable();
        endDateControl?.setValidators([Validators.required]);
      }
      
      endDateControl?.updateValueAndValidity();
    });
  }

  /**
   * Cargar educación para editar
   */
  loadEducation(id: string): void {
    this.loading.set(true);
    this.educationService.getById(id).subscribe({
      next: (education) => {
        // Convertir fechas a formato YYYY-MM-DD para input date
        const startDate = new Date(education.startDate).toISOString().split('T')[0];
        const endDate = education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '';

        this.educationForm.patchValue({
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startDate: startDate,
          endDate: endDate,
          isCurrentlyStudying: education.isCurrentlyStudying,
          description: education.description || '',
          displayOrder: education.displayOrder || 0
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar educación:', error);
        alert('Error al cargar la educación');
        this.router.navigate(['/admin/education']);
        this.loading.set(false);
      }
    });
  }

  /**
   * Guardar educación (crear o actualizar)
   */
  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.markFormGroupTouched(this.educationForm);
      return;
    }

    this.saving.set(true);

    const formValue = this.educationForm.value;
    const dto = {
      institution: formValue.institution,
      degree: formValue.degree,
      fieldOfStudy: formValue.fieldOfStudy,
      startDate: formValue.startDate,
      endDate: formValue.isCurrentlyStudying ? undefined : formValue.endDate,
      isCurrentlyStudying: formValue.isCurrentlyStudying,
      description: formValue.description || undefined,
      displayOrder: formValue.displayOrder || 0
    };

    if (this.isEditMode() && this.educationId()) {
      // Actualizar
      this.educationService.update(this.educationId()!, dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/education']);
        },
        error: (error) => {
          console.error('Error al actualizar educación:', error);
          alert('Error al guardar la educación');
          this.saving.set(false);
        }
      });
    } else {
      // Crear
      this.educationService.create(dto).subscribe({
        next: () => {
          this.router.navigate(['/admin/education']);
        },
        error: (error) => {
          console.error('Error al crear educación:', error);
          alert('Error al guardar la educación');
          this.saving.set(false);
        }
      });
    }
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    this.router.navigate(['/admin/education']);
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
    const field = this.educationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtener mensaje de error
   */
  getErrorMessage(fieldName: string): string {
    const field = this.educationForm.get(fieldName);
    
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
   * Obtener el valor de isCurrentlyStudying
   */
  get isCurrentlyStudying(): boolean {
    return this.educationForm.get('isCurrentlyStudying')?.value || false;
  }
}