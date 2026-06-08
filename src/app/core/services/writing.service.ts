import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WRITINGS_API } from '../constants/api.constants';
import { Writing } from '../models/writing.model';
import { WritingLayout } from '../models/writing-layout.model';

export interface CreateWritingRequest {
  story: number;
  text: string;
  layout?: WritingLayout;
}

@Injectable({ providedIn: 'root' })
export class WritingService {
  private readonly http = inject(HttpClient);

  createWriting(payload: CreateWritingRequest): Observable<Writing> {
    return this.http.post<Writing>(WRITINGS_API, payload);
  }
}
