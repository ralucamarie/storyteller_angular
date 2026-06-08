import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AUTH_API } from '../constants/api.constants';
import { FavoriteAuthorsResponse } from '../models/favorite-author.model';
import { ProfileDashboard } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<ProfileDashboard> {
    return this.http.get<ProfileDashboard>(AUTH_API.dashboard);
  }

  getFavoriteStoryIds(): Observable<number[]> {
    return this.http
      .get<{ story_ids?: number[]; storyIds?: number[] }>(AUTH_API.favorites)
      .pipe(map((response) => response.story_ids ?? response.storyIds ?? []));
  }

  getFavoriteAuthors(): Observable<FavoriteAuthorsResponse> {
    return this.http.get<FavoriteAuthorsResponse>(AUTH_API.favoriteAuthors);
  }

  addFavoriteAuthor(authorId: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${AUTH_API.favoriteAuthors}${authorId}/`, {});
  }

  removeFavoriteAuthor(authorId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API.favoriteAuthors}${authorId}/`);
  }

  addFavorite(storyId: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${AUTH_API.favorites}${storyId}/`, {});
  }

  removeFavorite(storyId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API.favorites}${storyId}/`);
  }
}
