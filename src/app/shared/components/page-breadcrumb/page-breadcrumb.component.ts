import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [Breadcrumb, RouterLink, TranslatePipe],
  templateUrl: './page-breadcrumb.component.html',
  styleUrl: './page-breadcrumb.component.scss',
})
export class PageBreadcrumbComponent {
  readonly items = input.required<MenuItem[]>();

  readonly breadcrumbModel = computed(() =>
    this.items().map((item, index, allItems) => {
      if (index === allItems.length - 1) {
        const { routerLink: _routerLink, ...currentItem } = item;
        return currentItem;
      }
      return item;
    })
  );
}
