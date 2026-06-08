import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { COMMENTS_API } from '../constants/api.constants';
import { Comment, CommentReactionEmoji } from '../models/comment.model';

export interface CreateCommentRequest {
  story_id: number;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);

  createComment(payload: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(COMMENTS_API, payload);
  }

  updateComment(id: number, payload: UpdateCommentRequest): Observable<Comment> {
    return this.http.patch<Comment>(`${COMMENTS_API}${id}/`, payload);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${COMMENTS_API}${id}/`);
  }

  toggleLike(id: number): Observable<Comment> {
    return this.http.post<Comment>(`${COMMENTS_API}${id}/like/`, {});
  }

  react(id: number, emoji: CommentReactionEmoji): Observable<Comment> {
    return this.http.post<Comment>(`${COMMENTS_API}${id}/react/`, { emoji });
  }
}
