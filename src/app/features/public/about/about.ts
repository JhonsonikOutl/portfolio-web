import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileHeroComponent } from '../../../shared/components/profile-hero/profile-hero';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink, ProfileHeroComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  stats = [
    { value: '6+',   label: 'Años de Experiencia' },
    { value: '10+',  label: 'Proyectos' },
    { value: '10+',  label: 'Tecnologías Dominadas' },
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
}