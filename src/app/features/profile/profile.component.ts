import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Avatar } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { profileLevelTitleKey } from '../../core/constants/level-titles.constants';
import { FavoriteAuthorSummary } from '../../core/models/favorite-author.model';
import {
  ActivityPoint,
  ProfileDashboard,
  ProfileStorySummary,
} from '../../core/models/profile.model';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { MediaService } from '../../core/services/media.service';
import { resolveAvatarUrl, withCacheBust } from '../../core/utils/media.utils';
import { PageBreadcrumbComponent } from '../../shared/components/page-breadcrumb/page-breadcrumb.component';
import { Button } from 'primeng/button';

type ActivityView = 'daily' | 'weekly';

@Component({
  selector: 'app-profile',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    Avatar,
    Card,
    ProgressBar,
    SelectButton,
    Skeleton,
    Tag,
    Tooltip,
    PageBreadcrumbComponent,
    Button,
    TranslatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly mediaService = inject(MediaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly favoriteAuthors = signal<FavoriteAuthorSummary[]>([]);
  readonly uploadingAvatar = signal(false);
  readonly avatarPreview = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly dashboard = signal<ProfileDashboard | null>(null);
  readonly activityView = signal<ActivityView>('daily');

  readonly activityOptions = signal<
    { label: string; value: ActivityView }[]
  >([]);

  readonly activeActivity = computed<ActivityPoint[]>(() => {
    const data = this.dashboard()?.activity;
    if (!data) {
      return [];
    }
    return this.activityView() === 'daily' ? data.daily : data.weekly;
  });

  readonly maxActivityCount = computed(() => {
    const points = this.activeActivity();
    return Math.max(...points.map((point) => point.count), 1);
  });

  readonly xpPercent = computed(() => {
    const gamification = this.dashboard()?.gamification;
    if (!gamification) {
      return 0;
    }
    return Math.round((gamification.level_progress / gamification.level_max) * 100);
  });

  readonly profileAvatarUrl = computed(() => {
    const preview = this.avatarPreview();
    if (preview) {
      return preview;
    }
    const user = this.dashboard()?.user;
    return withCacheBust(
      resolveAvatarUrl(user),
      user?.avatarUpdated ?? user?.avatar_updated ?? null
    );
  });

  ngOnInit(): void {
    this.refreshActivityOptions();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshActivityOptions());

    forkJoin({
      dashboard: this.profileService.getDashboard(),
      favoriteAuthors: this.profileService.getFavoriteAuthors(),
    }).subscribe({
      next: ({ dashboard, favoriteAuthors }) => {
        this.dashboard.set(dashboard);
        this.favoriteAuthors.set(favoriteAuthors.authors ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translate.instant('profile.loadError'));
        this.loading.set(false);
      },
    });
  }

  browseAuthorStories(author: FavoriteAuthorSummary): void {
    void this.router.navigate(['/dashboard'], {
      queryParams: { author: author.author_name },
    });
  }

  removeFavoriteAuthor(author: FavoriteAuthorSummary, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.profileService.removeFavoriteAuthor(author.id).subscribe({
      next: () => {
        this.favoriteAuthors.update((authors) =>
          authors.filter((item) => item.id !== author.id)
        );
      },
      error: () => {
        this.errorMessage.set(this.translate.instant('profile.favoriteAuthorRemoveError'));
      },
    });
  }

  barHeight(count: number): string {
    const max = this.maxActivityCount();
    const percent = max === 0 ? 0 : (count / max) * 100;
    return `${Math.max(percent, count > 0 ? 12 : 4)}%`;
  }

  shortLabel(label: string): string {
    if (this.activityView() === 'daily') {
      return label.slice(5);
    }
    return label.split(' ').slice(0, 2).join(' ');
  }

  trackStory(_index: number, story: ProfileStorySummary): number {
    return story.id;
  }

  levelLabel(level: number): string {
    const n = Math.max(1, Math.floor(level));
    return this.translate.instant('profile.levelLabel', {
      level: n,
      title: this.translate.instant(profileLevelTitleKey(level)),
    });
  }

  nextLevelCaption(level: number): string {
    const nextLevel = Math.max(1, Math.floor(level)) + 1;
    return this.translate.instant(profileLevelTitleKey(nextLevel));
  }

  private refreshActivityOptions(): void {
    this.activityOptions.set([
      {
        label: this.translate.instant('profile.activity7days'),
        value: 'daily',
      },
      {
        label: this.translate.instant('profile.activity6weeks'),
        value: 'weekly',
      },
    ]);
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.avatarPreview.set(URL.createObjectURL(file));
    this.uploadingAvatar.set(true);
    this.mediaService.uploadAvatar(file).subscribe({
      next: (user) => {
        this.uploadingAvatar.set(false);
        this.authService.currentUser.set(user);
        this.dashboard.update((current) =>
          current ? { ...current, user: { ...current.user, ...user } } : current
        );
        input.value = '';
      },
      error: () => {
        this.uploadingAvatar.set(false);
        this.avatarPreview.set(null);
        this.errorMessage.set(this.translate.instant('profile.avatarUploadError'));
        input.value = '';
      },
    });
  }

  removeAvatar(): void {
    this.uploadingAvatar.set(true);
    this.mediaService.deleteAvatar().subscribe({
      next: () => {
        this.uploadingAvatar.set(false);
        this.avatarPreview.set(null);
        this.authService.currentUser.update((user) =>
          user ? { ...user, avatarUrl: null, avatarUpdated: null } : user
        );
        this.dashboard.update((current) =>
          current
            ? {
                ...current,
                user: { ...current.user, avatarUrl: null, avatarUpdated: null },
              }
            : current
        );
      },
      error: () => {
        this.uploadingAvatar.set(false);
        this.errorMessage.set(this.translate.instant('profile.avatarRemoveError'));
      },
    });
  }
}
