import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Editor } from 'primeng/editor';
import { Message } from 'primeng/message';
import { MediaService } from '../../../core/services/media.service';
import {
  buildWritingImageHtml,
  WritingImagePlacement,
} from '../../../core/utils/writing-html.utils';

@Component({
  selector: 'app-writing-rich-editor',
  imports: [FormsModule, Editor, Message, TranslatePipe],
  templateUrl: './writing-rich-editor.component.html',
  styleUrl: './writing-rich-editor.component.scss',
  host: {
    '[class.writing-rich-editor--scrollable]': 'scrollable()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WritingRichEditorComponent),
      multi: true,
    },
  ],
})
export class WritingRichEditorComponent implements ControlValueAccessor {
  private readonly mediaService = inject(MediaService);
  private readonly translate = inject(TranslateService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly placeholder = input('');
  readonly scrollable = input(false);
  readonly editorStyle = input<Record<string, string>>({ height: '320px' });
  readonly inputId = input<string | undefined>(undefined);

  readonly uploadError = signal<string | null>(null);
  readonly uploadingImage = signal(false);

  value = '';
  disabled = false;

  private quill: any = null;
  private pendingPlacement: WritingImagePlacement = 'block';
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onEditorInit(event: { editor: unknown }): void {
    this.quill = event.editor;
  }

  onModelChange(value: string): void {
    this.value = value ?? '';
    this.onChange(this.value);
  }

  onTextChange(event: { htmlValue: string | null; source?: string }): void {
    if (event.source !== 'user') {
      return;
    }
    this.onModelChange(event.htmlValue ?? '');
  }

  onBlur(): void {
    this.onTouched();
  }

  requestImage(placement: WritingImagePlacement): void {
    if (this.disabled || this.uploadingImage()) {
      return;
    }
    this.pendingPlacement = placement;
    this.fileInput?.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this.quill) {
      return;
    }

    this.uploadError.set(null);
    this.uploadingImage.set(true);

    this.mediaService.uploadWritingInlineImage(file).subscribe({
      next: ({ url }) => {
        this.uploadingImage.set(false);
        this.insertImageHtml(url, this.pendingPlacement);
      },
      error: () => {
        this.uploadingImage.set(false);
        this.uploadError.set(this.translate.instant('writingEditor.imageUploadError'));
      },
    });
  }

  private insertImageHtml(url: string, placement: WritingImagePlacement): void {
    const html = buildWritingImageHtml(url, placement);
    const range = this.quill.getSelection(true);
    const index = range?.index ?? this.quill.getLength();
    this.quill.clipboard.dangerouslyPasteHTML(index, html);
    this.quill.setSelection(index + 1);
    this.onModelChange(this.quill.root.innerHTML);
  }
}
