import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type AppLanguage = 'ro' | 'en';

const STORAGE_KEY = 'storyteller_lang';
export const DEFAULT_LANGUAGE: AppLanguage = 'ro';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['ro', 'en'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly currentLang = () => this.translate.getCurrentLang() as AppLanguage;

  init(): Promise<unknown> {
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);
    this.translate.setFallbackLang(DEFAULT_LANGUAGE);

    const stored = this.readStoredLanguage();
    return firstValueFrom(this.translate.use(stored));
  }

  setLanguage(lang: AppLanguage): Promise<unknown> {
    localStorage.setItem(STORAGE_KEY, lang);
    return firstValueFrom(this.translate.use(lang));
  }

  languageLabel(lang: AppLanguage): string {
    return lang === 'ro' ? 'Română' : 'English';
  }

  private readStoredLanguage(): AppLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ro' || stored === 'en') {
      return stored;
    }
    return DEFAULT_LANGUAGE;
  }
}
