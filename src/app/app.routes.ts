import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { AdminPage } from './admin/admin.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
    canActivate: [publicGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      {
        path: 'home',
        loadComponent: () => import('./admin/home/home.page').then(m => m.HomePage)
      },

      {
        path: 'usuarios',
        loadComponent: () => import('./admin/usuarios/usuarios.page').then(m => m.UsuariosPage),
        children: [
          {
            path: '',
            redirectTo: 'alta-usuario',
            pathMatch: 'full',
          },
          {
            path: 'alta-usuario',
            loadComponent: () => import('./admin/usuarios/alta-usuario/alta-usuario.page').then(m => m.AltaUsuarioPage)
          },
          {
            path: 'alta-grado',
            loadComponent: () => import('./admin/usuarios/alta-grado/alta-grado.page').then(m => m.AltaGradoPage)
          },
          {
            path: 'alta-grupo',
            loadComponent: () => import('./admin/usuarios/alta-grupo/alta-grupo.page').then(m => m.AltaGrupoPage)
          },
          {
            path: 'alta-categoria',
            loadComponent: () => import('./admin/usuarios/alta-categoria/alta-categoria.page').then(m => m.AltaCategoriaPage)
          },
        ]
      },
      { path: 'estudiante', loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then(m => m.PlaceholderPage) },
      { path: 'profesor', loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then(m => m.PlaceholderPage) },
      { path: 'tutor', loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then(m => m.PlaceholderPage) },
      { path: 'comunicados', loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then(m => m.PlaceholderPage) },
      { path: 'productos', loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then(m => m.PlaceholderPage) },
    ],
  },
  {
    path: 'placeholder',
    loadComponent: () => import('./admin/placeholders/placeholder/placeholder.page').then( m => m.PlaceholderPage)
  },

];
