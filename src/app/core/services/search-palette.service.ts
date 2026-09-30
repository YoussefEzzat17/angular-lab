import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchPaletteService {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }
}
