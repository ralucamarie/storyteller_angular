import { Component, inject, input, output, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import {
  WritingAssistMode,
  WritingAssistRequest,
  WritingAssistService,
} from '../../../core/services/writing-assist.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-writing-assist-panel',
  imports: [Button, Message, ProgressSpinner, TranslatePipe],
  templateUrl: './writing-assist-panel.component.html',
  styleUrl: './writing-assist-panel.component.scss',
})
export class WritingAssistPanelComponent {
  private readonly assistService = inject(WritingAssistService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  readonly storyId = input<number | null>(null);
  readonly storyTitle = input('');
  readonly storyCategories = input<string[]>([]);
  readonly draftText = input('');

  readonly insertText = output<string>();

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly resultTitle = signal<string | null>(null);
  readonly resultContent = signal<string | null>(null);

  request(mode: WritingAssistMode): void {
    const storyId = this.storyId();
    const lang = this.languageService.currentLang();
    const draftText = this.draftText().trim() || undefined;

    const payload: WritingAssistRequest = {
      mode,
      lang,
      draft_text: draftText,
    };

    if (storyId) {
      payload.story_id = storyId;
    } else {
      payload.title = this.storyTitle().trim();
      payload.categories = this.storyCategories();
    }

    this.loading.set(true);
    this.error.set(null);
    this.resultTitle.set(null);
    this.resultContent.set(null);

    this.assistService
      .assist(payload)
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.resultTitle.set(response.title);
          this.resultContent.set(response.content);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.error?.detail ?? this.translate.instant('writingAssist.error')
          );
        },
      });
  }

  useInDraft(): void {
    const title = this.resultTitle();
    const content = this.resultContent();
    if (!content) {
      return;
    }
    const block = title ? `${title}\n\n${content}` : content;
    this.insertText.emit(block);
  }

  clear(): void {
    this.error.set(null);
    this.resultTitle.set(null);
    this.resultContent.set(null);
  }
}
