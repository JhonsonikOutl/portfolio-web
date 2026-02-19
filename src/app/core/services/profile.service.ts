import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, UpdateProfile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener perfil público
   */
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl);
  }

  /**
   * Actualizar perfil (requiere autenticación)
   */
  updateProfile(profile: UpdateProfile): Observable<Profile> {
    return this.http.put<Profile>(this.apiUrl, profile);
  }

  downloadCv(): void {
    const cvUrl = `${environment.apiUrl}/profile/resume`;
    window.open(cvUrl, '_blank');
  }
}