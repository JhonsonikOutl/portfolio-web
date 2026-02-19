import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Skill, CreateSkill, UpdateSkill } from '../../shared/models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las habilidades
   */
  getAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  /**
   * Obtener habilidad por ID
   */
  getById(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener habilidades por categoría
   */
  getByCategory(category: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Obtener categorías únicas
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Crear habilidad (requiere autenticación)
   */
  create(skill: CreateSkill): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill);
  }

  /**
   * Actualizar habilidad (requiere autenticación)
   */
  update(id: string, skill: UpdateSkill): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, skill);
  }

  /**
   * Eliminar habilidad (requiere autenticación)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}