import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://127.0.0.1:8000/api/comments';

  // TODO: return relevant messages for success opertaions
  createComment(comment: Object):Observable<any>{
    return this.http.post(`${this.apiUrl}/`, comment).pipe(
      catchError((error: HttpErrorResponse) => throwError(()=> error))
    );
  }

  deleteComment(commentId: number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${commentId}/`).pipe(
      catchError((error: HttpErrorResponse) => throwError(()=> error))
    )
  }

  editComment(commentId: number, comment: Object):Observable<any>{
    return this.http.put(`${this.apiUrl}/${commentId}/`, comment).pipe(
      catchError((error: HttpErrorResponse) => throwError(()=> error))
    )
  }
}
