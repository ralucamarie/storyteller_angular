import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '', // Main layout
    component: MainLayoutComponent,
    loadChildren: () => import('./layouts/main-layout/main-layout.routes').then(m => m.MAIN_LAYOUT_ROUTES)
  },
  { path: '**', redirectTo: 'auth/login' } // Redirect unknown routes to login
];
