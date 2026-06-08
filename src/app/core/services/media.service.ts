import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_API, WRITINGS_API } from '../constants/api.constants';
import { IUser } from '../models/user.model';
import { Writing } from '../models/writing.model';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  uploadAvatar(file: File): Observable<IUser> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<IUser>(AUTH_API.avatar, formData);
  }

  deleteAvatar(): Observable<void> {
    return this.http.delete<void>(AUTH_API.avatar);
  }

  uploadWritingImage(writingId: number, file: File): Observable<Writing> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<Writing>(`${WRITINGS_API}${writingId}/image/`, formData);
  }

  deleteWritingImage(writingId: number): Observable<void> {
    return this.http.delete<void>(`${WRITINGS_API}${writingId}/image/`);
  }
}
