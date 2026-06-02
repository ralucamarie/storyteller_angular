import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { IStoryOverview, Story } from '../models/story.model';
import { Writing } from '../models/writing.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/stories/'; // Django API URL

  // Signal to store the story details
  story: WritableSignal<Story | null> = signal<Story | null>(null);

  constructor(private http: HttpClient) {}

  getStories(): Observable<any[]> {
    return this.http.get<IStoryOverview[]>(this.apiUrl);
  }

  getStory(id: string): void{
    this.http.get<Story>(`${this.apiUrl}${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching story:', error);
          return of(null); // Handle errors gracefully
        })
      )
      .subscribe(data => {
        this.story.set(data); // Update the signal with the response
      });
  }

  /** Persists an updated writing segment; wire to Django when the endpoint exists. */
  saveWriting(writingId: number, text: string): Observable<Writing> {
    const url = `http://127.0.0.1:8000/api/writings/${writingId}/`;
    return this.http.patch<Writing>(url, { text }).pipe(
      tap(updated => this.applyWritingUpdate(updated))
    );
  }

  private applyWritingUpdate(updated: Writing): void {
    const current = this.story();
    if (!current?.writings || updated.id == null) {
      return;
    }
    const writings = current.writings.map(w =>
      w.id === updated.id ? { ...w, ...updated, text: updated.text ?? w.text } : w
    );
    this.story.set({ ...current, writings });
  }
}
