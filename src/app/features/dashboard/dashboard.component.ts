import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { StoryOverviewComponent } from './components/story-overview/story-overview.component';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Category } from '../../core/models/category.model';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Tag } from 'primeng/tag';
import { CategoryFormatPipe } from '../../core/pipes/category-format.pipe';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    StoryOverviewComponent,
    Toolbar,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    FormsModule,
CategoryFormatPipe,
    Tag
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // List of all stories, ordered by most recent. TODO: Add criteria for refining the selected
  //  stories that will be displayed here. eg. - prefered users, prefered categories etc -> add these
  // questions in the registration process so you can create a profile of the user and serve relevant content

  stories: Array<any> = [];
  filteredStories: Array<any> = [];
  toolbarItems: MenuItem[] | undefined;
  categories: Array<Category> = [];
  selectedCategories: Array<Category> = [];
  storyFilter: {
    text: string,
    authors: Array<string>,
    categories: Array<Category>,
  } = { text: '', authors: [], categories: [] };
  authors: Array<any> = [];

  constructor(
    private categoryService: CategoryService,
    private storyService: StoryService) {
  }

  ngOnInit(): void {
    this.initStories();
    this.stories = [
      {
        id: 1,
        title: 'Once upon a time in the Black Valley',
        author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' },
        categories: [{ id: 1, name: 'fantasy' }, { id: 2, name: 'travel' }, { id: 3, name: 'history' }],
        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'Lu' }
          }
        ]
      },
      {
        id: 2,
        title: 'Never lie again!',
        author: { name: 'Sunny', surname: 'Joe', authorName: 'Zoridezi' },
        categories: [{ id: 1, name: 'horror' }, { id: 2, name: 'mysteryThriller' }],
        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'BusterAl' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'BusterAl' }
          }

        ]
      },
      {
        id: 3,
        title: 'That time of you',
        author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' },
        categories: [{ id: 1, name: 'memoir' }],
        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'BusterAl' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'Mintyblue' }
          }
        ]
      },
      {
        id: 4,
        title: 'The storm inside',
        author: { name: 'Sunny', surname: 'Joe', authorName: 'Mintyblue' },
        categories: [{ id: 1, name: 'selfHelp' }, { id: 2, name: 'health' }],
        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'Mintyblue' }
          }

        ]
      },
      {
        id: 5,
        title: 'The history of a romantic dinner',
        author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' },
        categories: [{ id: 1, name: 'romance' }, { id: 2, name: 'fantasy' }, { id: 3, name: 'adventure' }],
        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'Mintyblue' }
          }
        ]
      },
      {
        id: 6,
        title: 'Hurt',
        author: { name: 'Sunny', surname: 'Joe', authorName: 'Mintyblue' },
        categories: [{ id: 1, name: 'health' }, { id: 2, name: 'sports' }],

        writings: [
          {
            id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Mint', surname: 'Alexandra', authorName: 'Mintyblue' }

          },
          {
            id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam ex nibh, ' +
              'aliquet molestie est tristique blandit. Maecenas pretium sapien ac dolor euismod interdum. ' +
              'Aenean tempor est nibh, non mollis enim bibendum at. Sed elementum orci ac scelerisque cursus. ' +
              'Aliquam eget odio at nisl blandit molestie. Integer quis mauris quis eros convallis pellentesque non at neque. ' +
              'Donec sed magna arcu. Morbi arcu orci, facilisis at scelerisque sed, consequat eu nibh. ' +
              'Ut efficitur, arcu faucibus congue ultricies, tellus risus tempus metus, ut lacinia metus tortor ac risus. ' +
              'Curabitur volutpat semper nibh, non fringilla enim dapibus eget. Mauris vel leo nec mi eleifend fermentum.',
            author: { name: 'Pepa', surname: 'Luiza', authorName: 'Mintyblue' }
          }

        ]
      }

    ];
    this.filteredStories = [...this.stories];
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
    this.categories = this.categoryService.getStoryCategories();
    this.authors = [
      {
        label: 'My stories',
        value: 'me',
        items: [
          { label: 'My Stories', value: 'me' }
        ]
      },
      {
        label: 'Favorites',
        value: 'fav',
        items: [
          { label: 'Mintyblue', value: 'Mintyblue' },
          { label: 'Lu', value: 'Lu' }
        ]
      }];
  }

  resetCategories(): void {
    this.selectedCategories = [];
    this.filteredStories = [...this.stories];
  }

  filterStories(): void {}

  private initStories(): void {
    this.storyService.getStories().subscribe((stories) => {
      this.stories = stories;
      this.filteredStories = stories
    });
  }
}
