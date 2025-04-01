import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tooltip } from 'primeng/tooltip';
import { Writing } from '../../core/models/writing.model';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Divider } from 'primeng/divider';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/services/story.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../core/services/comments.service';
import { tap } from 'rxjs/operators';
import { StoryToolbarComponent } from '../../shared/story-toolbar/story-toolbar.component';

@Component({
  selector: 'app-story-details',
  imports: [
    Avatar,
    Tooltip,
    Divider,
    Textarea,
    Card,
    Button,
    FormsModule,
    StoryToolbarComponent
  ],
  templateUrl: './story-details.component.html',
  styleUrl: './story-details.component.scss'
})
export class StoryDetailsComponent implements OnInit {
  private storyService = inject(StoryService);
  private route = inject(ActivatedRoute);

  story: WritableSignal<Story | null> = this.storyService.story;

  items: Array<MenuItem> | undefined;
  commentContent: string | null = null;

  constructor(private authService: AuthService,
              private commentService: CommentsService) {
  }

  ngOnInit(): void {
    this.storyService.setStoryEditMode(false);
    this.getStoryDetails();
  }

  getTooltip(writing: Writing | any): string {
    return `${writing.author?.authorName} \n ${writing.created}`;
  }

  private getStoryDetails(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.storyService.getStory(id.toString());
      }
    });
  }

  addComment(): void {
    const userId = this.authService.getUser()?.user_id;
    const storyId = this.story()?.id;

    if (!userId || !storyId || !this.commentContent) {
      console.error('Missing required fields: userId, storyId, or content.');
      return;
    }

    this.commentService.createComment({
      author_id: userId,
      content: this.commentContent,
      story_id: storyId
    }).pipe(
      tap(() => {
        this.storyService.getStory(storyId);
      })
    ).subscribe({
      next: () => {
        this.commentContent = null;
      },
      error: () => {
        console.log('error');
      }
    });
  }

  deleteComment(id: number | null | undefined) {

    const storyId = this.story()?.id;
    if (!storyId || !id) {
      return;
    }

    this.commentService.deleteComment(id).pipe(
      tap(() => {
        this.storyService.getStory(storyId!);
      })
    ).subscribe({
      error: () => {
        console.log('error');
      }
    });
  }
}
