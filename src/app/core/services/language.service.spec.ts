import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DEFAULT_LANGUAGE, LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  const STORAGE_KEY = 'storyteller_lang';

  beforeEach(() => {
    translateSpy = jasmine.createSpyObj<TranslateService>('TranslateService', [
      'addLangs',
      'setFallbackLang',
      'use',
      'getCurrentLang',
    ]);
    translateSpy.use.and.returnValue(of({}) as any);

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateSpy },
      ],
    });
    service = TestBed.inject(LanguageService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('persists and applies the selected language', async () => {
    await service.setLanguage('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
    expect(translateSpy.use).toHaveBeenCalledWith('en');
  });

  it('falls back to the default language when none is stored', async () => {
    await service.init();
    expect(translateSpy.use).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
    expect(translateSpy.setFallbackLang).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
  });

  it('uses the stored language on init when valid', async () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    await service.init();
    expect(translateSpy.use).toHaveBeenCalledWith('en');
  });

  it('returns human-readable language labels', () => {
    expect(service.languageLabel('ro')).toBe('Română');
    expect(service.languageLabel('en')).toBe('English');
  });
});
