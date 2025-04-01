import { Routes } from '@angular/router';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { StoryDetailsComponent } from '../../features/story-details/story-details.component';
import { AddStoryComponent } from '../../features/add-story/add-story.component';

export const MAIN_LAYOUT_ROUTES: Routes = [
  { path: '', redirectTo:'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'story-details/:id', component: StoryDetailsComponent },
  { path: 'add-story', component: AddStoryComponent },
];
