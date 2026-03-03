import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SessionSettings } from '../../../shared/models/session-settings.model';

interface UpdateSessionSettingsDto {
  inactivityTimeoutMinutes: number;
  warningBeforeTimeoutMinutes: number;
  isEnabled: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/settings/session`;
  
  settingsForm!: FormGroup;
  loading = signal(false);
  saving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.settingsForm = this.fb.group({
      inactivityTimeoutMinutes: [15, [
        Validators.required,
        Validators.min(1),
        Validators.max(1440) // Máximo 24 horas
      ]],
      warningBeforeTimeoutMinutes: [1, [
        Validators.required,
        Validators.min(0),
        Validators.max(60)
      ]],
      isEnabled: [true]
    });
  }

  /**
   * Carga la configuración actual
   */
  async loadSettings(): Promise<void> {
    this.loading.set(true);
    this.clearMessages();

    try {
      const settings = await this.http.get<SessionSettings>(this.apiUrl).toPromise();
      
      if (settings) {
        this.settingsForm.patchValue({
          inactivityTimeoutMinutes: settings.inactivityTimeoutMinutes,
          warningBeforeTimeoutMinutes: settings.warningBeforeTimeoutMinutes,
          isEnabled: settings.isEnabled
        });
      }
    } catch (error: any) {
      this.errorMessage.set('Error al cargar la configuración: ' + (error.message || 'Error desconocido'));
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Guarda la configuración actualizada
   */
  async saveSettings(): Promise<void> {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }

    // Validación adicional: warning debe ser menor que timeout
    const timeout = this.settingsForm.value.inactivityTimeoutMinutes;
    const warning = this.settingsForm.value.warningBeforeTimeoutMinutes;

    if (warning >= timeout) {
      this.errorMessage.set('El tiempo de advertencia debe ser menor al timeout total');
      return;
    }

    this.saving.set(true);
    this.clearMessages();

    try {
      const dto: UpdateSessionSettingsDto = this.settingsForm.value;
      
      await this.http.put<SessionSettings>(this.apiUrl, dto).toPromise();
      
      this.successMessage.set('✅ Configuración guardada correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        this.successMessage.set(null);
      }, 3000);
    } catch (error: any) {
      this.errorMessage.set('Error al guardar: ' + (error.error?.error || error.message || 'Error desconocido'));
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Resetea el formulario a valores por defecto
   */
  resetToDefaults(): void {
    this.settingsForm.patchValue({
      inactivityTimeoutMinutes: 15,
      warningBeforeTimeoutMinutes: 1,
      isEnabled: true
    });
    this.clearMessages();
  }

  /**
   * Limpia mensajes de éxito/error
   */
  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  /**
   * Marca todos los campos del formulario como touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene errores y fue tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error de un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.settingsForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('min')) {
      return `El valor mínimo es ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `El valor máximo es ${field.errors?.['max'].max}`;
    }
    
    return '';
  }
}