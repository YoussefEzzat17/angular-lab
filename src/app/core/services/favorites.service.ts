import { effect, Injectable, signal } from '@angular/core';

import { readStored, validIds, writeStored } from './safe-storage';

export const FAVORITES_KEY = 'angular-lab:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly addedDates = new Map<number, string>();
  readonly ids = signal<number[]>([]);

  constructor() {
    const saved = readStored<{ ids?: unknown; dates?: Record<string, string> } | null>(FAVORITES_KEY, null);
    this.ids.set(validIds(saved?.ids));
    for (const id of this.ids()) {
      const date = saved?.dates?.[id];
      if (typeof date === 'string') this.addedDates.set(id, date);
    }
    effect(() => writeStored(FAVORITES_KEY, { ids: this.ids(), dates: Object.fromEntries(this.addedDates) }));
  }

  toggle(id: number): void {
    if (this.ids().includes(id)) {
      this.addedDates.delete(id);
      this.ids.update((ids) => ids.filter((item) => item !== id));
    } else {
      this.addedDates.set(id, new Date().toISOString());
      this.ids.update((ids) => [...ids, id]);
    }
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }
}
