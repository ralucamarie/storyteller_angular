import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  categoryTranslationKey,
  formatCategory,
  getCategoryColor,
} from '../utils/category-format.utils';

@Pipe({
  name: 'categoryFormat',
  pure: false,
})
export class CategoryFormatPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(value: string | null): ReturnType<typeof formatCategory> {
    if (!value) {
      return { label: '', color: '' };
    }
    const key = categoryTranslationKey(value);
    const translated = this.translate.instant(key);
    const label = translated === key ? formatCategory(value).label : translated;
    return { label, color: getCategoryColor(value) };
  }
}
