import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Education, CreateEducation, UpdateEducation } from '../../shared/models/education.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiUrl = `${environment.apiUrl}/education`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las educaciones
   */
  getAll(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  /**
   * Obtener educación por ID
   */
  getById(id: string): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear educación (requiere autenticación)
   */
  create(education: CreateEducation): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, education);
  }

  /**
   * Actualizar educación (requiere autenticación)
   */
  update(id: string, education: UpdateEducation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, education);
  }

  /**
   * Eliminar educación (requiere autenticación)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

export type { Education };