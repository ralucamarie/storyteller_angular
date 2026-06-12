import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tag } from 'primeng/tag';
import { CategoryFormatPipe } from '../../../../core/pipes/category-format.pipe';
import { IStory} from '../../../../core/models/story.model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { ProfileService } from '../../../../core/services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StoryService } from '../../../../core/services/story.service';
import { formatCategory } from '../../../../core/utils/category-format.utils';
import {
  resolveAvatarUrl,
  withCacheBust,
} from '../../../../core/utils/media.utils';
import { extractFirstImageUrl, writingPreviewText } from '../../../../core/utils/writing-html.utils';
import { getFirstWriting } from '../../../../core/utils/writing.utils';
import { AuthorFavoriteIconComponent } from '../../../../shared/components/author-favorite-icon/author-favorite-icon.component';

@Component({
  selector: 'app-story-overview',
  imports: [
    Avatar,
    Button,
    Menu,
    Tag,
    CategoryFormatPipe,
    RouterLink,
    Tooltip,
    DatePipe,
    AuthorFavoriteIconComponent,
    TranslatePipe,
  ],
  templateUrl: './story-overview.component.html',
  styleUrl: './story-overview.component.scss'
})
export class StoryOverviewComponent {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly storyService = inject(StoryService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  private readonly categoriesHost = viewChild<ElementRef<HTMLElement>>('categoriesHost');

  readonly story = input<IStory>();
  readonly layout = input<'list' | 'grid'>('list');
  readonly isFavorite = input(false);
  readonly isFavoriteAuthor = input(false);
  readonly favoriteChanged = output<{ storyId: number; favorited: boolean }>();
  readonly authorFavoriteChanged = output<{
    authorId: number;
    authorName: string | null;
    favorited: boolean;
  }>();
  readonly storyDeleted = output<number>();

  readonly favorited = signal(false);
  readonly authorFavorited = signal(false);
  readonly deleting = signal(false);

  readonly menuItems = signal<MenuItem[]>([]);

  readonly firstWriting = computed(() => getFirstWriting(this.story()));

  readonly writingExcerpt = computed(() => writingPreviewText(this.firstWriting()?.text));

  readonly coverImageUrl = computed(() => {
    const firstWriting = this.firstWriting();
    const url = extractFirstImageUrl(
      firstWriting?.text ?? null,
      firstWriting?.imageUrl ?? firstWriting?.image_url ?? null
    );
    return withCacheBust(
      url,
      firstWriting?.imageUpdated ?? firstWriting?.image_updated ?? null
    );
  });

  readonly authorAvatarUrl = computed(() => {
    const author = this.story()?.author;
    return withCacheBust(
      resolveAvatarUrl(author),
      author?.avatarUpdated ?? author?.avatar_updated ?? null
    );
  });

  authorAvatarLabel(): string {
    const name = this.story()?.author?.author_name?.trim();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  readonly visibleCategoryCount = signal(-1);
  readonly categoriesTruncated = signal(false);

  readonly visibleCategories = computed(() => {
    const all = this.storyCategories(this.story());
    const count = this.visibleCategoryCount();
    if (count < 0) {
      return all;
    }
    return all.slice(0, count);
  });

  readonly allCategoriesTooltip = computed(() =>
    this.storyCategories(this.story())
      .map((category) => formatCategory(category.name).label)
      .filter((label) => label.length > 0)
      .join(', ')
  );

  private fitScheduled = false;

  constructor() {
    this.refreshMenuItems();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshMenuItems());

    effect(() => {
      this.story();
      this.refreshMenuItems();
    });

    effect(() => {
      this.favorited.set(this.isFavorite());
    });
    effect(() => {
      this.authorFavorited.set(this.isFavoriteAuthor());
    });

    afterNextRender(() => {
      const host = this.categoriesHost()?.nativeElement;
      if (!host) {
        return;
      }

      const observer = new ResizeObserver(() => this.scheduleCategoryFit());
      observer.observe(host);
      if (host.parentElement) {
        observer.observe(host.parentElement);
      }
      this.destroyRef.onDestroy(() => observer.disconnect());

      effect(() => {
        this.story();
        this.layout();
        this.storyCategories(this.story());
        this.scheduleCategoryFit();
      });
    });
  }

  private refreshMenuItems(): void {
    if (!this.isOwnStory()) {
      this.menuItems.set([]);
      return;
    }

    this.menuItems.set([
      {
        label: this.translate.instant('common.edit'),
        icon: 'pi pi-pencil',
        command: () => this.editStory(),
      },
      { separator: true },
      {
        label: this.translate.instant('common.delete'),
        icon: 'pi pi-trash',
        command: () => this.confirmDeleteStory(),
      },
    ]);
  }

  private scheduleCategoryFit(): void {
    if (this.fitScheduled) {
      return;
    }
    this.fitScheduled = true;
    requestAnimationFrame(() => {
      this.fitScheduled = false;
      void this.fitCategories();
    });
  }

  private async fitCategories(): Promise<void> {
    const host = this.categoriesHost()?.nativeElement;
    const all = this.storyCategories(this.story());

    if (!host || all.length === 0) {
      this.visibleCategoryCount.set(0);
      this.categoriesTruncated.set(false);
      return;
    }

    for (let count = all.length; count >= 0; count--) {
      this.visibleCategoryCount.set(count);
      this.categoriesTruncated.set(count < all.length);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const element = this.categoriesHost()?.nativeElement;
      if (!element) {
        return;
      }

      if (element.scrollWidth <= element.clientWidth + 1) {
        return;
      }
    }

    this.visibleCategoryCount.set(0);
    this.categoriesTruncated.set(true);
  }

  storyCategories(story: IStory | undefined) {
    if (!story) {
      return [];
    }
    return story.categories?.length ? story.categories : story.categoryObjects ?? [];
  }

  isOwnStory(): boolean {
    const currentUser = this.authService.currentUser();
    const authorId = this.story()?.author?.id;
    return !!currentUser?.id && Number(currentUser.id) === Number(authorId);
  }

  authorDashboardParams(): { author: string } | null {
    if (this.isOwnStory()) {
      return { author: '__me__' };
    }

    const authorName = this.story()?.author?.author_name?.trim();
    return authorName ? { author: authorName } : null;
  }

  editStory(): void {
    const storyId = this.story()?.id;
    if (!storyId) {
      return;
    }
    void this.router.navigate(['/story-details', storyId]);
  }

  confirmDeleteStory(): void {
    const storyId = Number(this.story()?.id);
    if (!storyId) {
      return;
    }

    this.confirmationService.confirm({
      message: this.translate.instant('dashboard.deleteStory.message'),
      header: this.translate.instant('dashboard.deleteStory.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleting.set(true);
        this.storyService.deleteStory(storyId).subscribe({
          next: () => {
            this.deleting.set(false);
            if (Number(this.storyService.story()?.id) === storyId) {
              this.storyService.story.set(null);
            }
            this.storyDeleted.emit(storyId);
          },
          error: () => {
            this.deleting.set(false);
          },
        });
      },
    });
  }

  toggleAuthorFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const authorId = Number(this.story()?.author?.id);
    if (!authorId || this.isOwnStory()) {
      return;
    }

    if (this.authorFavorited()) {
      this.profileService.removeFavoriteAuthor(authorId).subscribe({
        next: () => {
          this.authorFavorited.set(false);
          this.authorFavoriteChanged.emit({
            authorId,
            authorName: this.story()?.author?.author_name ?? null,
            favorited: false,
          });
        },
      });
      return;
    }

    this.profileService.addFavoriteAuthor(authorId).subscribe({
      next: () => {
        this.authorFavorited.set(true);
        this.authorFavoriteChanged.emit({
          authorId,
          authorName: this.story()?.author?.author_name ?? null,
          favorited: true,
        });
      },
    });
  }

  toggleStoryFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const storyId = Number(this.story()?.id);
    if (!storyId) {
      return;
    }

    if (this.favorited()) {
      this.profileService.removeFavorite(storyId).subscribe({
        next: () => {
          this.favorited.set(false);
          this.favoriteChanged.emit({ storyId, favorited: false });
        },
      });
      return;
    }

    this.profileService.addFavorite(storyId).subscribe({
      next: () => {
        this.favorited.set(true);
        this.favoriteChanged.emit({ storyId, favorited: true });
      },
    });
  }
}
