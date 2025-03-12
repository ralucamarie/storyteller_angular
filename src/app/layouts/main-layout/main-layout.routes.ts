import { Routes } from '@angular/router';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { StoryDetailsComponent } from '../../features/story-details/story-details.component';

export const MAIN_LAYOUT_ROUTES: Routes = [
  { path: '', redirectTo:'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'story-details/:id', component: StoryDetailsComponent },
];
