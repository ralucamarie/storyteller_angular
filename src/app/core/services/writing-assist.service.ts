import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WRITING_ASSIST_API } from '../constants/api.constants';

export type WritingAssistMode = 'suggestion' | 'game';

export interface WritingAssistRequest {
  story_id?: number;
  title?: string;
  categories?: string[];
  mode: WritingAssistMode;
  lang: 'ro' | 'en';
  draft_text?: string;
}

export interface WritingAssistResponse {
  mode: WritingAssistMode;
  title: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class WritingAssistService {
  private readonly http = inject(HttpClient);

  assist(payload: WritingAssistRequest): Observable<WritingAssistResponse> {
    return this.http.post<WritingAssistResponse>(WRITING_ASSIST_API, payload);
  }
}
