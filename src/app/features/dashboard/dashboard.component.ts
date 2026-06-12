import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Button } from 'primeng/button';

import { IconField } from 'primeng/iconfield';

import { InputIcon } from 'primeng/inputicon';

import { InputText } from 'primeng/inputtext';

import { MultiSelect } from 'primeng/multiselect';

import { FormsModule } from '@angular/forms';

import { SelectButton } from 'primeng/selectbutton';

import { PrimeTemplate } from 'primeng/api';

import { Tag } from 'primeng/tag';

import { Tooltip } from 'primeng/tooltip';

import { catchError, forkJoin, of } from 'rxjs';

import { ConfirmDialog } from 'primeng/confirmdialog';

import { CategoryFormatPipe } from '../../core/pipes/category-format.pipe';

import {

  FavoriteAuthorSummary,

  FavoriteAuthorsResponse,

} from '../../core/models/favorite-author.model';

import { Category } from '../../core/models/category.model';

import { IStory } from '../../core/models/story.model';

import { AuthService } from '../../core/services/auth.service';

import { ProfileService } from '../../core/services/profile.service';

import { StoryService } from '../../core/services/story.service';

import { DashboardFilterService } from '../../core/services/dashboard-filter.service';

import { writingPreviewText } from '../../core/utils/writing-html.utils';

import { StoryOverviewComponent } from './components/story-overview/story-overview.component';



interface AuthorFilterOption {

  label: string;

  value: string;

}



interface AuthorFilterGroup {

  label: string;

  items: AuthorFilterOption[];

}



type StoryViewMode = 'list' | 'grid';



@Component({

  selector: 'app-dashboard',

  imports: [

    StoryOverviewComponent,

    IconField,

    InputIcon,

    InputText,

    MultiSelect,

    FormsModule,

    CategoryFormatPipe,

    Tag,

    Button,

    Tooltip,

    ConfirmDialog,

    SelectButton,

    PrimeTemplate,

    TranslatePipe,

  ],

  templateUrl: './dashboard.component.html',

  styleUrl: './dashboard.component.scss',

})

export class DashboardComponent implements OnInit {

  private readonly authService = inject(AuthService);

  private readonly profileService = inject(ProfileService);

  private readonly storyService = inject(StoryService);

  private readonly dashboardFilterService = inject(DashboardFilterService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);



  stories: IStory[] = [];

  filteredStories: IStory[] = [];

  loadingStories = true;

  loadError: string | null = null;

  categories: Category[] = [];

  authors: AuthorFilterGroup[] = [];

  favoriteStoryIds = new Set<number>();

  favoriteAuthorIds = new Set<number>();

  favoriteAuthors: FavoriteAuthorSummary[] = [];

  showOnlyFavorites = false;

  storyViewMode: StoryViewMode = 'list';



  readonly storyViewOptions = signal<

    { label: string; value: StoryViewMode; icon: string }[]

  >([]);



  storyFilter: {

    text: string;

    authors: string[];

    categories: Category[];

  } = { text: '', authors: [], categories: [] };



  ngOnInit(): void {

    this.refreshStoryViewOptions();

    this.translate.onLangChange

      .pipe(takeUntilDestroyed(this.destroyRef))

      .subscribe(() => {

        this.refreshStoryViewOptions();

        this.buildAuthorGroups();

      });



    this.loadDashboardData();



    this.route.queryParamMap

      .pipe(takeUntilDestroyed(this.destroyRef))

      .subscribe(() => {

        this.applyAuthorQueryFilter();

        if (this.stories.length) {

          this.filterStories();

        }

      });



    this.dashboardFilterService.reset$

      .pipe(takeUntilDestroyed(this.destroyRef))

      .subscribe(() => {

        this.resetAllFilters(false);

      });

  }



  private refreshStoryViewOptions(): void {

    this.storyViewOptions.set([

      {

        label: this.translate.instant('dashboard.list'),

        value: 'list',

        icon: 'pi pi-list',

      },

      {

        label: this.translate.instant('dashboard.grid'),

        value: 'grid',

        icon: 'pi pi-th-large',

      },

    ]);

  }



  hasActiveFilters(): boolean {

    return (

      this.storyFilter.text.trim().length > 0 ||

      this.storyFilter.authors.length > 0 ||

      this.storyFilter.categories.length > 0 ||

      this.showOnlyFavorites

    );

  }



  authorFilterLabel(value: string): string {

    return value === '__me__'

      ? this.translate.instant('dashboard.myStories')

      : value;

  }



  removeSearchFilter(): void {

    this.storyFilter.text = '';

    this.filterStories();

  }



  removeAuthorFilter(value: string): void {

    this.storyFilter.authors = this.storyFilter.authors.filter((author) => author !== value);

    this.syncAuthorQueryParams();

    this.filterStories();

  }



  removeCategoryFilter(category: Category): void {

    this.storyFilter.categories = this.storyFilter.categories.filter(

      (item) => item.id !== category.id && item.name !== category.name

    );

    this.filterStories();

  }



  removeFavoritesFilter(): void {

    this.showOnlyFavorites = false;

    this.filterStories();

  }



  resetAllFilters(clearQueryParams = true): void {

    this.storyFilter = { text: '', authors: [], categories: [] };

    this.showOnlyFavorites = false;



    if (clearQueryParams) {

      void this.router.navigate(['/dashboard'], {

        queryParams: {},

        replaceUrl: true,

      });

    }



    this.filterStories();

  }



  private syncAuthorQueryParams(): void {

    const author = this.storyFilter.authors.length === 1 ? this.storyFilter.authors[0] : null;

    void this.router.navigate(['/dashboard'], {

      queryParams: author ? { author } : {},

      replaceUrl: true,

    });

  }



  private applyAuthorQueryFilter(): void {

    const author = this.route.snapshot.queryParamMap.get('author')?.trim();

    this.storyFilter.authors = author ? [author] : [];

    this.sanitizeAuthorFilter();

  }



  private sanitizeAuthorFilter(): void {

    const selected = this.storyFilter.authors;

    if (!selected.length || !this.stories.length) {

      return;

    }



    const valid = selected.filter((value) => {

      if (value === '__me__') {

        return this.stories.some((story) => this.isMyStory(story));

      }

      return this.stories.some((story) => this.getAuthorName(story) === value);

    });



    if (valid.length !== selected.length) {

      this.storyFilter.authors = valid;

      if (valid.length <= 1) {

        this.syncAuthorQueryParams();

      } else {

        void this.router.navigate(['/dashboard'], {

          queryParams: {},

          replaceUrl: true,

        });

      }

    }

  }



  private loadDashboardData(): void {

    this.loadingStories = true;

    this.loadError = null;



    forkJoin({

      stories: this.storyService.getStories().pipe(catchError(() => of([] as IStory[]))),

      favoriteIds: this.profileService.getFavoriteStoryIds().pipe(catchError(() => of([]))),

      favoriteAuthors: this.profileService

        .getFavoriteAuthors()

        .pipe(

          catchError(() => of({ authors: [], author_ids: [] } as FavoriteAuthorsResponse))

        ),

    }).subscribe({

      next: ({ stories, favoriteIds, favoriteAuthors }) => {

        this.stories = this.sortStoriesByRecent(stories ?? []);

        this.favoriteStoryIds = new Set(favoriteIds ?? []);

        this.favoriteAuthors = favoriteAuthors.authors ?? [];

        this.favoriteAuthorIds = new Set(

          favoriteAuthors.author_ids ?? favoriteAuthors.authorIds ?? []

        );

        this.categories = this.buildCategoryOptions(this.stories);

        this.buildAuthorGroups();

        this.applyAuthorQueryFilter();

        this.filterStories();

        this.loadingStories = false;

      },

      error: () => {

        this.loadingStories = false;

        this.loadError = this.translate.instant('dashboard.loadError');

        this.stories = [];

        this.filteredStories = [];

      },

    });

  }



  filterStories(): void {

    this.filteredStories = this.sortStoriesByRecent(

      this.stories.filter(

        (story) =>

          this.matchesTextFilter(story) &&

          this.matchesAuthorFilter(story) &&

          this.matchesCategoryFilter(story) &&

          this.matchesFavoriteFilter(story)

      )

    );

  }



  toggleFavoritesFilter(): void {

    this.showOnlyFavorites = !this.showOnlyFavorites;

    this.filterStories();

  }



  onAuthorFavoriteChanged(authorId: number, favorited: boolean, authorName?: string | null): void {

    if (favorited) {

      this.favoriteAuthorIds.add(authorId);

      if (authorName && !this.favoriteAuthors.some((author) => author.id === authorId)) {

        this.favoriteAuthors = [...this.favoriteAuthors, { id: authorId, author_name: authorName }];

      }

    } else {

      this.favoriteAuthorIds.delete(authorId);

      this.favoriteAuthors = this.favoriteAuthors.filter((author) => author.id !== authorId);

    }

    this.buildAuthorGroups();

    this.filterStories();

  }



  isFavoriteAuthor(story: IStory): boolean {

    const authorId = story.author?.id;

    return authorId != null && this.favoriteAuthorIds.has(authorId);

  }



  onStoryDeleted(storyId: number): void {

    this.stories = this.stories.filter((story) => Number(story.id) !== storyId);

    this.favoriteStoryIds.delete(storyId);

    this.buildAuthorGroups();

    this.filterStories();

  }



  onFavoriteChanged(storyId: number, favorited: boolean): void {

    if (favorited) {

      this.favoriteStoryIds.add(storyId);

    } else {

      this.favoriteStoryIds.delete(storyId);

    }

    this.filterStories();

  }



  isFavoriteStory(story: IStory): boolean {

    return this.favoriteStoryIds.has(Number(story.id));

  }



  isSearchActive(): boolean {

    return this.storyFilter.text.trim().length > 0;

  }



  resultsLabel(): string {

    const count = this.filteredStories.length;

    const noun = this.translate.instant(

      count === 1 ? 'dashboard.story' : 'dashboard.stories'

    );

    const key = this.isSearchActive()

      ? 'dashboard.resultsFound'

      : 'dashboard.resultsShowing';

    return this.translate.instant(key, { count, noun });

  }



  private matchesTextFilter(story: IStory): boolean {

    const query = this.storyFilter.text.trim().toLowerCase();

    if (!query) {

      return true;

    }



    const title = story.title?.toLowerCase() ?? '';

    const author = this.getAuthorName(story)?.toLowerCase() ?? '';

    const content = (story.writings ?? [])

      .map((writing) => writingPreviewText(writing.text).toLowerCase())

      .join(' ');



    return title.includes(query) || author.includes(query) || content.includes(query);

  }



  private matchesAuthorFilter(story: IStory): boolean {

    const selected = this.storyFilter.authors;

    if (!selected.length) {

      return true;

    }



    const authorName = this.getAuthorName(story);

    const isMine = this.isMyStory(story);



    return selected.some((value) => {

      if (value === '__me__') {

        return isMine;

      }

      return authorName === value;

    });

  }



  private matchesCategoryFilter(story: IStory): boolean {

    const selected = this.storyFilter.categories;

    if (!selected.length) {

      return true;

    }



    const storyCategories = this.getStoryCategories(story);

    return selected.some((category) =>

      storyCategories.some(

        (storyCategory) =>

          storyCategory.id === category.id || storyCategory.name === category.name

      )

    );

  }



  private matchesFavoriteFilter(story: IStory): boolean {

    if (!this.showOnlyFavorites) {

      return true;

    }

    return this.favoriteStoryIds.has(Number(story.id));

  }



  private buildCategoryOptions(stories: IStory[]): Category[] {

    const categories = new Map<string, Category>();



    for (const story of stories) {

      for (const category of this.getStoryCategories(story)) {

        if (category.name) {

          categories.set(category.name, category);

        }

      }

    }



    return [...categories.values()].sort((a, b) =>

      (a.name ?? '').localeCompare(b.name ?? '')

    );

  }



  private buildAuthorGroups(): void {

    const currentUser = this.authService.currentUser();

    const myAuthorName = currentUser?.author_name ?? null;

    const allAuthors = new Set<string>();

    const favoriteAuthorNames = new Set(

      this.favoriteAuthors

        .map((author) => author.author_name)

        .filter((name): name is string => !!name && name !== myAuthorName)

    );



    for (const story of this.stories) {

      const authorName = this.getAuthorName(story);

      if (authorName) {

        allAuthors.add(authorName);

      }

    }



    const otherAuthors = [...allAuthors]

      .filter((name) => name !== myAuthorName && !favoriteAuthorNames.has(name))

      .sort();



    const myStoriesLabel = this.translate.instant('dashboard.myStories');



    this.authors = [

      {

        label: myStoriesLabel,

        items: [{ label: myStoriesLabel, value: '__me__' }],

      },

    ];



    if (favoriteAuthorNames.size) {

      this.authors.push({

        label: this.translate.instant('dashboard.favoriteAuthors'),

        items: [...favoriteAuthorNames]

          .sort()

          .map((name) => ({ label: name, value: name })),

      });

    }



    if (otherAuthors.length) {

      this.authors.push({

        label: this.translate.instant('dashboard.otherAuthors'),

        items: otherAuthors.map((name) => ({ label: name, value: name })),

      });

    }

  }



  private getStoryCategories(story: IStory): Category[] {

    if (story.categories?.length) {

      return story.categories;

    }

    return story.categoryObjects ?? [];

  }



  private getAuthorName(story: IStory): string | null {

    return story.author?.author_name ?? story.author_name ?? null;

  }



  private isMyStory(story: IStory): boolean {

    const currentUser = this.authService.currentUser();

    if (!currentUser?.id) {

      return false;

    }



    return Number(story.author?.id) === Number(currentUser.id);

  }



  private sortStoriesByRecent(stories: IStory[]): IStory[] {

    return [...stories].sort((a, b) => {

      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return dateB - dateA;

    });

  }

}


