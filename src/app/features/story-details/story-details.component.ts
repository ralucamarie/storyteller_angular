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
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-story-details',
  imports: [
    Avatar,
    Tooltip,
    Divider,
    Textarea,
    Card,
    Button,
    SplitButton,
    Toolbar
  ],
  templateUrl: './story-details.component.html',
  styleUrl: './story-details.component.scss'
})
export class StoryDetailsComponent implements OnInit {
  private storyService = inject(StoryService);
  private route = inject(ActivatedRoute);

  story: WritableSignal<Story | null> = this.storyService.story;

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
}
