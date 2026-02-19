import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, CreateProject, UpdateProject } from '../../shared/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los proyectos
   */
  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  /**
   * Obtener proyecto por ID
   */
  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener proyectos destacados
   */
  getFeatured(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/featured`);
  }

  /**
   * Crear proyecto (requiere autenticación)
   */
  create(project: CreateProject): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  /**
   * Actualizar proyecto (requiere autenticación)
   */
  update(id: string, project: UpdateProject): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, project);
  }

  /**
   * Eliminar proyecto (requiere autenticación)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}