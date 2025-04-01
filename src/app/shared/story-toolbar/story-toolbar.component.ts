import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-story-toolbar',
  imports: [
    Toolbar,
    Button,
    SplitButton
  ],
  templateUrl: './story-toolbar.component.html',
  styleUrl: './story-toolbar.component.scss'
})
export class StoryToolbarComponent implements OnInit {
  storyService: StoryService = inject(StoryService)
  @Output() public storySaved: EventEmitter<any> = new EventEmitter();

  storyEditMode = this.storyService.storyEditMode;
  // TODO: move the items in a service serving static data
  items = [
    { icon: 'pi pi-home', routerLink: '/' },
    { icon: 'pi pi-comments' },
    { icon: 'pi pi-heart' }];

  toolbarItems = [
    {
      label: 'Update',
      icon: 'pi pi-refresh'
    },
    {
      label: 'Delete',
      icon: 'pi pi-times'
    }
  ];


  ngOnInit(): void {
    this.storyService.setStoryEditMode(true);
  }

  saveStory():void {
    this.storySaved.emit(true);
  }

  editStory(): void {
    this.storyService.setStoryEditMode(true);
  }

}
