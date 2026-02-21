import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';

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

  // Ruta de login (sin layout admin)
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login').then(m => m.Login)
  },

  // Rutas admin con layout compartido
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/admin/projects/projects').then(m => m.AdminProjects)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./features/admin/projects/project-form/project-form').then(m => m.ProjectForm)
      },
      {
        path: 'projects/edit/:id',
        loadComponent: () => import('./features/admin/projects/project-form/project-form').then(m => m.ProjectForm)
      }
    ]
  },

  // Ruta por defecto
  { path: '**', redirectTo: '' }
];