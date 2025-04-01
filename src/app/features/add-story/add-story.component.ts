import { Component, inject, OnInit } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { StoryToolbarComponent } from '../../shared/story-toolbar/story-toolbar.component';
import { StoryService } from '../../core/services/story.service';
import { MultiSelect } from 'primeng/multiselect';
import { DropdownItem } from '../../core/models/dropdown.model';
import { DropdownService } from '../../core/services/dropdown.service';
import { Story } from '../../core/models/story.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-story',
  imports: [
    Avatar,
    FormsModule,
    InputText,
    FloatLabel,
    Textarea,
    StoryToolbarComponent,
    MultiSelect
  ],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.scss'
})
export class AddStoryComponent implements OnInit {
  storyService = inject(StoryService);
  authService = inject(AuthService);
  dropdownService = inject(DropdownService);
  router = inject(Router);

  currentUser: User | null = null;
  storyContent: string = '';
  storyTitle: string = '';
  selectedCategories: Array<DropdownItem<string>> = [];
  categories: Array<any> = this.dropdownService.getStoryCategories();

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    console.log(this.currentUser);
  }

  saveStory() {
    //TODO: create models for all the dtos
    const storyPayload = {
      title: this.storyTitle,
      categories: this.selectedCategories.map((category): string => category.value),
      content: this.storyContent
    };
    this.storyService.createStory(storyPayload).pipe(
    ).subscribe({
      next: (story: Story): void => {
        console.log(story)
        this.storyService.setStoryEditMode(false);
        this.router.navigate([`/story-details/${story.id}`]);
      }
    });

  }

}
