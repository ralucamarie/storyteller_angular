import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { IStoryOverview, Story } from '../models/story.model';

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
}
