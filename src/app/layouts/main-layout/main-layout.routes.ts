import { Routes } from '@angular/router';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { StoryDetailsComponent } from '../../features/story-details/story-details.component';
import { NewStoryComponent } from '../../features/new-story/new-story.component';
import { ProfileComponent } from '../../features/profile/profile.component';
import { InfoPageComponent } from '../../features/info-page/info-page.component';

export const MAIN_LAYOUT_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'new-story', component: NewStoryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'story-details/:id', component: StoryDetailsComponent },
  {
    path: 'about',
    component: InfoPageComponent,
    data: { infoPageKey: 'about' },
  },
  {
    path: 'privacy',
    component: InfoPageComponent,
    data: { infoPageKey: 'privacy' },
  },
  {
    path: 'terms',
    component: InfoPageComponent,
    data: { infoPageKey: 'terms' },
  },
  {
    path: 'contact',
    component: InfoPageComponent,
    data: { infoPageKey: 'contact' },
  },
];
