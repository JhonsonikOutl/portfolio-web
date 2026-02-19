import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../shared/models/profile.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  stats = [
    { value: '6+', label: 'Años de Experiencia' },
    { value: '10+', label: 'Proyectos' },
    { value: '10+', label: 'Tecnologías Dominadas' },
    { value: '100%', label: 'Compromiso' }
  ];

  values = [
    {
      icon: '🎯',
      title: 'Orientado a Resultados',
      description: 'Enfocado en entregar soluciones que generen valor real al negocio.'
    },
    {
      icon: '🚀',
      title: 'Aprendizaje Continuo',
      description: 'Siempre explorando nuevas tecnologías y mejores prácticas de desarrollo.'
    },
    {
      icon: '🤝',
      title: 'Trabajo en Equipo',
      description: 'Colaboración efectiva con equipos multidisciplinarios para alcanzar objetivos comunes.'
    },
    {
      icon: '💡',
      title: 'Innovación',
      description: 'Búsqueda constante de soluciones creativas y eficientes a problemas complejos.'
    }
  ];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el perfil');
        this.loading.set(false);
        console.error('Error loading profile:', err);
      }
    });
  }

  downloadCv(): void {
    this.profileService.downloadCv();
  }
}