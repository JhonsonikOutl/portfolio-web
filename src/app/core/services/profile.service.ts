import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, UpdateProfile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;
  private profileSignal = signal<Profile | null>(null);
  public profile = this.profileSignal.asReadonly();
  public loading = signal(false);

  constructor(private http: HttpClient) { }

  /**
   * Carga el perfil desde la API y actualiza el signal global.
   */
  loadProfile(): void {
    if (this.profileSignal()) return;

    this.loading.set(true);
    this.http.get<Profile>(this.apiUrl).subscribe({
      next: (data) => {
        this.profileSignal.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.loading.set(false);
      }
    });
  }

  /**
   * Obtener perfil público (Legacy/Manual)
   */
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl).pipe(
      tap(data => this.profileSignal.set(data))
    );
  }

  /**
   * Actualizar perfil
   */
  updateProfile(profile: UpdateProfile): Observable<Profile> {
    return this.http.put<Profile>(this.apiUrl, profile).pipe(
      tap(updated => this.profileSignal.set(updated))
    );
  }

  downloadCv(): void {
    const cvUrl = `${environment.apiUrl}/profile/resume`;
    window.open(cvUrl, '_blank');
  }
}