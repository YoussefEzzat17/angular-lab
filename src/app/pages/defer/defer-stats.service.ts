import { Injectable, signal } from '@angular/core';

/**
 * Counts how many times the heavy widget has actually been created, so the lesson can prove it was lazy.
 * It lives in its own file so the page can use it without importing the widget's file: a deferred
 * component only gets its own chunk when nothing else imports the file it lives in.
 */
@Injectable({ providedIn: 'root' })
export class DeferStatsService {
  readonly created = signal(0);
}
