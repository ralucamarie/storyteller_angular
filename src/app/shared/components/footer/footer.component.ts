import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface FooterLink {
  label: string;
  route?: string;
  fragment?: string;
  external?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly year = new Date().getFullYear();
  columns: FooterColumn[] = [];

  ngOnInit(): void {
    this.buildColumns();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.buildColumns());
  }

  private buildColumns(): void {
    this.columns = [
      {
        title: this.translate.instant('footer.explore'),
        links: [
          { label: this.translate.instant('footer.stories'), route: '/dashboard' },
          { label: this.translate.instant('footer.newStory'), route: '/new-story' },
          { label: this.translate.instant('footer.myProfile'), route: '/profile' },
          { label: this.translate.instant('footer.about'), route: '/about' },
        ],
      },
      {
        title: this.translate.instant('footer.legal'),
        links: [
          { label: this.translate.instant('footer.privacyPolicy'), route: '/privacy' },
          { label: this.translate.instant('footer.termsOfService'), route: '/terms' },
          {
            label: this.translate.instant('footer.cookiesStorage'),
            route: '/privacy',
            fragment: 'cookies',
          },
        ],
      },
      {
        title: this.translate.instant('footer.support'),
        links: [
          { label: this.translate.instant('footer.contactUs'), route: '/contact' },
          { label: this.translate.instant('footer.helpFaq'), route: '/contact' },
          {
            label: this.translate.instant('footer.reportContent'),
            route: '/contact',
            fragment: 'report',
          },
        ],
      },
    ];
  }
}
