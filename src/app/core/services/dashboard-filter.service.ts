import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFilterService {
  private readonly resetSubject = new Subject<void>();

  readonly reset$ = this.resetSubject.asObservable();

  requestReset(): void {
    this.resetSubject.next();
  }
}
