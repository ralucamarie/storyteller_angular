import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { IStory, IStoryOverview, Story } from '../models/story.model';

export interface CreateStoryRequest {
  title: string;
  content: string;
  categories: string[];
}

export interface TypingUser {
  author_name: string;
}

export interface TypingStatusResponse {
  typers: TypingUser[];
}

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/stories/`;

  story: WritableSignal<Story | null> = signal<Story | null>(null);

  getStories(): Observable<IStory[]> {
    return this.http.get<IStory[]>(this.apiUrl);
  }

  getStory(id: string): void {
    this.http
      .get<Story>(`${this.apiUrl}${id}/`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching story:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        this.story.set(data);
      });
  }

  createStory(payload: CreateStoryRequest): Observable<Story> {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('content', payload.content);
    payload.categories?.forEach((category) => form.append('categories', category));
    return this.http.post<Story>(this.apiUrl, form);
  }

  deleteStory(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  sendTypingPulse(storyId: string | number): Observable<TypingStatusResponse> {
    return this.http.post<TypingStatusResponse>(`${this.apiUrl}${storyId}/typing/`, {});
  }

  getTypingStatus(storyId: string | number): Observable<TypingStatusResponse> {
    return this.http.get<TypingStatusResponse>(`${this.apiUrl}${storyId}/typing/`);
  }
}
