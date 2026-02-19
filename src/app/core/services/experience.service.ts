import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience, CreateExperience, UpdateExperience } from '../../shared/models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = `${environment.apiUrl}/experiences`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las experiencias (ordenadas por fecha)
   */
  getAll(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.apiUrl);
  }

  /**
   * Obtener experiencia por ID
   */
  getById(id: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener trabajo actual
   */
  getCurrent(): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/current`);
  }

  /**
   * Crear experiencia (requiere autenticación)
   */
  create(experience: CreateExperience): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, experience);
  }

  /**
   * Actualizar experiencia (requiere autenticación)
   */
  update(id: string, experience: UpdateExperience): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, experience);
  }

  /**
   * Eliminar experiencia (requiere autenticación)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}