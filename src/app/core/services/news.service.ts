import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_API } from '../constants/api.constants';
import { NewsFeedResponse } from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);

  getNewsFeed(): Observable<NewsFeedResponse> {
    return this.http.get<NewsFeedResponse>(AUTH_API.news);
  }
}
