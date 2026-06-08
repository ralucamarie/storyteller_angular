import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppLanguage } from '../../../core/services/language.service';
import { NewsEvent, newsEventIcon } from '../../../core/models/news.model';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardFilterService } from '../../../core/services/dashboard-filter.service';
import { LanguageService } from '../../../core/services/language.service';
import { NewsService } from '../../../core/services/news.service';
import { newsEventMessage } from '../../../core/utils/news-i18n.utils';
import { resolveAvatarUrl, withCacheBust } from '../../../core/utils/media.utils';

@Component({
  selector: 'app-header',
  imports: [
    Avatar,
    RouterLink,
    Button,
    Popover,
    DatePipe,
    NgClass,
    TranslatePipe,
    FormsModule,
    ToggleSwitch,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dashboardFilterService = inject(DashboardFilterService);
  private readonly newsService = inject(NewsService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('userMenu') userMenu!: Popover;
  @ViewChild('newsPanel') newsPanel!: Popover;

  readonly currentUser = this.authService.currentUser;

  readonly headerAvatarUrl = computed(() => {
    const user = this.currentUser();
    return withCacheBust(
      resolveAvatarUrl(user),
      user?.avatarUpdated ?? user?.avatar_updated ?? null
    );
  });

  readonly newsItems = signal<NewsEvent[]>([]);
  readonly newsCount = signal(0);
  readonly newsLoading = signal(false);
  readonly newsError = signal<string | null>(null);

  private readonly langVersion = signal(0);

  readonly isEnglish = computed(() => {
    this.langVersion();
    return this.languageService.currentLang() === 'en';
  });

  ngOnInit(): void {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.langVersion.update((v) => v + 1);
      });

    if (this.currentUser()) {
      this.loadNews();
    }
  }

  newsIcon(event: NewsEvent): string {
    return newsEventIcon(event.type);
  }

  newsMessage(event: NewsEvent): string {
    return newsEventMessage(event, this.translate);
  }

  toggleNewsPanel(event: Event): void {
    this.newsPanel.toggle(event);
  }

  refreshNews(): void {
    this.loadNews();
  }

  openNewsItem(item: NewsEvent): void {
    this.newsPanel.hide();
    void this.router.navigate(['/story-details', item.storyId]);
  }

  goToStoriesOverview(event: Event): void {
    event.preventDefault();
    this.dashboardFilterService.requestReset();
    void this.router.navigate(['/dashboard'], {
      queryParams: {},
      replaceUrl: true,
    });
  }

  toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  logout(): void {
    this.authService.logout();
  }

  onLanguageSwitch(checked: boolean): void {
    const lang: AppLanguage = checked ? 'en' : 'ro';
    if (this.languageService.currentLang() !== lang) {
      void this.languageService.setLanguage(lang);
    }
  }

  private loadNews(): void {
    this.newsLoading.set(true);
    this.newsError.set(null);

    this.newsService.getNewsFeed().subscribe({
      next: (feed) => {
        this.newsItems.set(feed.items ?? []);
        this.newsCount.set(feed.count ?? feed.items?.length ?? 0);
        this.newsLoading.set(false);
      },
      error: () => {
        this.newsLoading.set(false);
        this.newsError.set(this.translate.instant('header.newsLoadError'));
        this.newsItems.set([]);
        this.newsCount.set(0);
      },
    });
  }
}
