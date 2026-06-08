import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CommentService } from './comment.service';
import { COMMENTS_API } from '../constants/api.constants';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('creates a comment with a POST to the comments endpoint', () => {
    service.createComment({ story_id: 7, content: 'Hi' }).subscribe();
    const req = httpMock.expectOne(COMMENTS_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ story_id: 7, content: 'Hi' });
    req.flush({});
  });

  it('updates a comment with PATCH to the detail URL', () => {
    service.updateComment(3, { content: 'Edited' }).subscribe();
    const req = httpMock.expectOne(`${COMMENTS_API}3/`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('deletes a comment with DELETE to the detail URL', () => {
    service.deleteComment(5).subscribe();
    const req = httpMock.expectOne(`${COMMENTS_API}5/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('toggles a like via the like action', () => {
    service.toggleLike(9).subscribe();
    const req = httpMock.expectOne(`${COMMENTS_API}9/like/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('reacts with the chosen emoji', () => {
    service.react(9, '❤️' as any).subscribe();
    const req = httpMock.expectOne(`${COMMENTS_API}9/react/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ emoji: '❤️' });
    req.flush({});
  });
});
