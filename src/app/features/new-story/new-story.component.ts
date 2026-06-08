import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { MultiSelect } from 'primeng/multiselect';
import { PrimeTemplate } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { CategoryFormatPipe } from '../../core/pipes/category-format.pipe';
import { StoryService } from '../../core/services/story.service';
import { WritingLayout } from '../../core/models/writing-layout.model';
import {
  categoryTranslationKey,
  getStoryCategoryOptions,
  StoryCategoryOption,
} from '../../core/utils/category-format.utils';
import { PageBreadcrumbComponent } from '../../shared/components/page-breadcrumb/page-breadcrumb.component';
import { WritingLayoutPickerComponent } from '../../shared/components/writing-layout-picker/writing-layout-picker.component';
import { WritingAssistPanelComponent } from '../../shared/components/writing-assist-panel/writing-assist-panel.component';

function categoriesRequired(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string[] | null | undefined;
  return value && value.length > 0 ? null : { categoriesRequired: true };
}

@Component({
  selector: 'app-new-story',
  imports: [
    ReactiveFormsModule,
    Card,
    InputText,
    Textarea,
    Button,
    Message,
    MultiSelect,
    Tag,
    CategoryFormatPipe,
    PageBreadcrumbComponent,
    WritingLayoutPickerComponent,
    WritingAssistPanelComponent,
    TranslatePipe,
  ],
  templateUrl: './new-story.component.html',
  styleUrl: './new-story.component.scss',
})
export class NewStoryComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storyService = inject(StoryService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedImageFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly selectedLayout = signal<WritingLayout>('stack');
  readonly categoryOptions = signal<StoryCategoryOption[]>([]);
  readonly assistTitle = signal('');
  readonly assistCategories = signal<string[]>([]);
  readonly assistDraft = signal('');
  readonly showAssist = signal(false);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    categories: this.fb.nonNullable.control<string[]>([], [categoriesRequired]),
    content: ['', [Validators.required, Validators.minLength(1)]],
  });

  ngOnInit(): void {
    this.refreshCategoryOptions();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshCategoryOptions());

    this.form.controls.title.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.assistTitle.set(value));

    this.form.controls.categories.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.assistCategories.set(value));

    this.form.controls.content.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.assistDraft.set(value));

    const initial = this.form.getRawValue();
    this.assistTitle.set(initial.title);
    this.assistCategories.set(initial.categories);
    this.assistDraft.set(initial.content);
  }

  toggleAssist(): void {
    this.showAssist.update((open) => !open);
  }

  onAssistInsert(text: string): void {
    const current = this.form.controls.content.value.trim();
    this.form.controls.content.setValue(current ? `${current}\n\n${text}` : text);
    this.form.controls.content.markAsDirty();
  }

  private refreshCategoryOptions(): void {
    this.categoryOptions.set(
      getStoryCategoryOptions((name) =>
        this.translate.instant(categoryTranslationKey(name))
      )
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedImageFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
    input.value = '';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { title, content, categories } = this.form.getRawValue();
    const file = this.selectedImageFile();
    this.storyService
      .createStory({
        title,
        content,
        categories,
        ...(file ? { image: file } : {}),
        layout: this.selectedLayout(),
      })
      .subscribe({
      next: (story) => {
        this.loading.set(false);
        this.router.navigate(['/story-details', story.id]);
      },
      error: (err) => {
        this.loading.set(false);
        const errors = err.error;
        if (typeof errors === 'object' && errors !== null) {
          const firstKey = Object.keys(errors)[0];
          const firstError = errors[firstKey];
          this.errorMessage.set(
            Array.isArray(firstError) ? firstError[0] : String(firstError)
          );
        } else {
          this.errorMessage.set(this.translate.instant('newStory.createError'));
        }
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
