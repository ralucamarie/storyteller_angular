import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Writing } from '../../core/models/writing.model';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Divider } from 'primeng/divider';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/services/story.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-story-details',
  imports: [
    Avatar,
    Divider,
    Textarea,
    Card,
    Button,
    SplitButton,
    Toolbar,
    FormsModule
  ],
  templateUrl: './story-details.component.html',
  styleUrl: './story-details.component.scss'
})
export class StoryDetailsComponent implements OnInit {
  private storyService = inject(StoryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  story: WritableSignal<Story | null> = this.storyService.story;
  editingWritingId = signal<number | null>(null);
  editText = '';
  savingWriting = signal(false);

  items: Array<MenuItem> | undefined;
  toolbarItems: MenuItem[] | undefined;

  ngOnInit(): void {
    this.getStoryDetails();

    this.items = [
      { icon: 'pi pi-home', routerLink: '/' },
      { icon: 'pi pi-comments' },
      { icon: 'pi pi-heart' }];
    this.toolbarItems = [
      {
        label: 'Update',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ];
  }

  getAuthorLabel(writing: Writing): string {
    const name = writing.author?.authorName ?? writing.authorName;
    const created = writing.created ? String(writing.created) : '';
    return created ? `${name}\n${created}` : (name ?? '');
  }

  canEditWriting(writing: Writing): boolean {
    const user = this.authService.currentUser();
    if (!user) {
      return false;
    }
    const writingAuthorId = writing.author?.id;
    if (user.id && writingAuthorId) {
      return user.id === writingAuthorId;
    }
    const writingAuthorName = writing.author?.authorName ?? writing.authorName;
    return !!user.authorName && user.authorName === writingAuthorName;
  }

  isEditing(writing: Writing): boolean {
    return this.editingWritingId() === writing.id;
  }

  startEdit(writing: Writing, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!writing.id) {
      return;
    }
    this.editingWritingId.set(writing.id);
    this.editText = writing.text ?? '';
  }

  cancelEdit(): void {
    this.editingWritingId.set(null);
    this.editText = '';
  }

  saveWriting(writing: Writing): void {
    const storyId = this.story()?.id;
    if (!writing.id || storyId == null || storyId === '' || this.savingWriting()) {
      return;
    }
    this.savingWriting.set(true);
    this.storyService.saveWriting(storyId, writing.id, this.editText).pipe(
      finalize(() => this.savingWriting.set(false))
    ).subscribe({
      next: () => this.cancelEdit(),
      error: err => console.error('Failed to save writing:', err)
    });
  }

  private getStoryDetails(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.storyService.getStory(id.toString());
      }
    });
  }
}
