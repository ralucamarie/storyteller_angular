import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Tooltip } from 'primeng/tooltip';
import {
  WRITING_LAYOUT_OPTIONS,
  WritingLayout,
} from '../../../core/models/writing-layout.model';

@Component({
  selector: 'app-writing-layout-picker',
  imports: [Tooltip, TranslatePipe],
  templateUrl: './writing-layout-picker.component.html',
  styleUrl: './writing-layout-picker.component.scss',
})
export class WritingLayoutPickerComponent {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = input.required<WritingLayout>();
  readonly disabled = input(false);
  readonly valueChange = output<WritingLayout>();

  readonly options = WRITING_LAYOUT_OPTIONS;

  private readonly langVersion = signal(0);

  layoutLabel(id: WritingLayout): string {
    this.langVersion();
    return this.translate.instant(`writingLayout.${id}.label`);
  }

  layoutShort(id: WritingLayout): string {
    this.langVersion();
    return this.translate.instant(`writingLayout.${id}.short`);
  }

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.langVersion.update((value) => value + 1));
  }

  select(layout: WritingLayout): void {
    if (this.disabled() || this.value() === layout) {
      return;
    }
    this.valueChange.emit(layout);
  }
}
