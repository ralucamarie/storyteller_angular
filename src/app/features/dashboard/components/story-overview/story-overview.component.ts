import { Component, input, OnInit } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { CategoryFormatPipe } from '../../../../core/pipes/category-format.pipe';
import { IStory} from '../../../../core/models/story.model';
import { Avatar } from 'primeng/avatar';
import { PrimeTemplate } from 'primeng/api';
import { TruncateTextPipe } from '../../../../core/pipes/truncate-story.pipe';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-story-overview',
  imports: [
    Panel,
    Button,
    Menu,
    Tag,
    CategoryFormatPipe,
    Avatar,
    PrimeTemplate,
    TruncateTextPipe,
    RouterLink,
    Tooltip,
    DatePipe
  ],
  templateUrl: './story-overview.component.html',
  styleUrl: './story-overview.component.scss'
})
export class StoryOverviewComponent implements OnInit {
  // TODO - replace type with IStoryOverview
  readonly story = input<IStory>();
  menuItems: { label?: string; icon?: string; separator?: boolean }[] = [];


  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil'
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ];
  }
}
