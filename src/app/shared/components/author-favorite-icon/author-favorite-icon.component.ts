import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-author-favorite-icon',
  standalone: true,
  template: `
    <svg class="author-favorite-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9.5V20a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.5"
        [attr.fill]="active() ? 'currentColor' : 'none'"
        [attr.stroke]="active() ? 'none' : 'currentColor'"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .author-favorite-icon {
      width: 1.15rem;
      height: 1.15rem;
    }
  `,
})
export class AuthorFavoriteIconComponent {
  readonly active = input(false, { transform: booleanAttribute });
}
