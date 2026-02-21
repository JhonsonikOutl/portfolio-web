import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    loadComponent: () => import('./features/public/home/home').then(m => m.Home)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/public/about/about').then(m => m.About)
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/public/skills/skills').then(m => m.Skills)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/public/projects/projects').then(m => m.Projects)
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/public/experience/experience').then(m => m.Experiences)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact/contact').then(m => m.Contact)
  },

  // Rutas admin
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login').then(m => m.Login)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'admin/projects',
    loadComponent: () => import('./features/admin/projects/projects').then(m => m.AdminProjects),
    canActivate: [authGuard]
  },

  {
    path: 'admin/projects/new',
    loadComponent: () => import('./features/admin/projects/project-form/project-form').then(m => m.ProjectForm),
    canActivate: [authGuard]
  },

  {
    path: 'admin/projects/edit/:id',
    loadComponent: () => import('./features/admin/projects/project-form/project-form').then(m => m.ProjectForm),
    canActivate: [authGuard]
  },

  // Ruta por defecto
  { path: '**', redirectTo: '' }
];