import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import {
  INFO_PAGE_SECTION_IDS,
  INFO_PAGE_STRUCTURE,
} from '../../core/constants/info-page-structure.constants';
import { InfoPageContent } from '../../core/constants/info-pages.constants';
import { PageBreadcrumbComponent } from '../../shared/components/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-info-page',
  imports: [Card, PageBreadcrumbComponent, TranslatePipe],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.scss',
})
export class InfoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pageKey = (this.route.snapshot.data['infoPageKey'] as string) ?? 'about';

  readonly page = signal<InfoPageContent | null>(null);

  ngOnInit(): void {
    this.loadPage();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadPage());
  }

  private loadPage(): void {
    this.page.set(this.buildPage(this.pageKey));
  }

  private buildPage(key: string): InfoPageContent {
    const resolvedKey = INFO_PAGE_STRUCTURE[key] ? key : 'about';
    const structure = INFO_PAGE_STRUCTURE[resolvedKey];
    const base = `info.${resolvedKey}`;
    const sectionIds = INFO_PAGE_SECTION_IDS[resolvedKey] ?? {};

    const sections = structure.sectionKeys.map((sectionKey) => {
      const prefix = `${base}.sections.${sectionKey}`;
      const paragraphs = this.translate.instant(`${prefix}.paragraphs`);
      return {
        heading: this.translate.instant(`${prefix}.heading`),
        paragraphs: Array.isArray(paragraphs) ? (paragraphs as string[]) : [],
        id: sectionIds[sectionKey],
      };
    });

    return {
      title: this.translate.instant(`${base}.title`),
      intro: this.translate.instant(`${base}.intro`),
      sections,
    };
  }
}
