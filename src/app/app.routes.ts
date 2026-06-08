import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layouts/main-layout/main-layout.routes').then(
        (m) => m.MAIN_LAYOUT_ROUTES
      ),
  },
  { path: '**', redirectTo: 'auth/login' },
];
