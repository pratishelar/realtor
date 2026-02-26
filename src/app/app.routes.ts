import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent) },
      { path: 'properties', loadComponent: () => import('./components/properties/properties.component').then((m) => m.PropertiesComponent) },
      { path: 'property/:id', loadComponent: () => import('./components/property-detail/property-detail.component').then((m) => m.PropertyDetailComponent) },
      { path: 'about', loadComponent: () => import('./components/about/about.component').then((m) => m.AboutComponent) },
      { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then((m) => m.ContactComponent) },
      { path: 'login', loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent) },
      { path: 'admin-login', loadComponent: () => import('./components/admin-login/admin-login.component').then((m) => m.AdminLoginComponent) },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
    ]
  },
  { path: '**', redirectTo: '' },
];
