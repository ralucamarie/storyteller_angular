import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import {
  WritingAssistResponse,
  WritingAssistService,
} from './writing-assist.service';
import { WRITING_ASSIST_API } from '../constants/api.constants';

describe('WritingAssistService', () => {
  let service: WritingAssistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WritingAssistService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(WritingAssistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts the assist payload and returns the response', () => {
    const response: WritingAssistResponse = {
      mode: 'suggestion',
      title: 'Idea',
      content: 'Try X',
    };
    let received: WritingAssistResponse | undefined;

    service
      .assist({ title: 'Quest', categories: ['Adventure'], mode: 'suggestion', lang: 'ro' })
      .subscribe((res) => (received = res));

    const req = httpMock.expectOne(WRITING_ASSIST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Quest',
      categories: ['Adventure'],
      mode: 'suggestion',
      lang: 'ro',
    });
    req.flush(response);

    expect(received).toEqual(response);
  });
});
