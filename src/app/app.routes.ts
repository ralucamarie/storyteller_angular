import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '', // Main layout
    component: MainLayoutComponent,
    loadChildren: () => import('./layouts/main-layout/main-layout.routes').then(m => m.MAIN_LAYOUT_ROUTES),
    canActivate: [AuthGuard]
  },
  { path: 'auth', children: AUTH_ROUTES },
  { path: '**', redirectTo: 'auth/login' }
];


