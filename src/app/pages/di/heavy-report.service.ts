import { Injectable } from '@angular/core';

/**
 * Pretend this service is big (a charting or PDF library). Nothing imports it directly: the DI lesson loads it
 * with injectAsync(), so its code lands in a separate file that is downloaded only when it is first needed.
 */
@Injectable({ providedIn: 'root' })
export class HeavyReportService {
  readonly loadedAt = new Date();

  build(title: string): string {
    return `Report "${title}" built at ${this.loadedAt.toLocaleTimeString()}`;
  }
}
