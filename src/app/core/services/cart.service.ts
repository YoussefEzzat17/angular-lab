import { computed, effect, Injectable, signal } from '@angular/core';

import { Product } from '../models/product.model';
import { readStored, validIds, writeStored } from './safe-storage';

export const WATCHLIST_KEY = 'angular-lab:watchlist';
export type AddResult = 'added' | 'duplicate' | 'out-of-stock';

/** The watchlist: a saved set of title ids (the navbar badge counts them). */
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly ids = signal<number[]>(validIds(readStored<unknown>(WATCHLIST_KEY, [])));
  readonly count = computed(() => this.ids().length);

  constructor() {
    effect(() => writeStored(WATCHLIST_KEY, this.ids()));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  add(product: Product): AddResult {
    if (product.stock <= 0) return 'out-of-stock';
    if (this.has(product.id)) return 'duplicate';
    this.ids.update((ids) => [...ids, product.id]);
    return 'added';
  }

  remove(id: number): void {
    this.ids.update((ids) => ids.filter((item) => item !== id));
  }

  clear(): void {
    this.ids.set([]);
  }
}
