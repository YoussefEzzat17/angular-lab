import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-600">YOUR QUEUE</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Watchlist</h1>
          <p class="mt-2 text-stone-400">{{ titles().length }} {{ titles().length === 1 ? 'title' : 'titles' }} saved on this device.</p>
        </div>
        @if (titles().length) {
          @if (confirming()) {
            <div class="flex items-center gap-2" role="group" aria-label="Confirm clearing the watchlist">
              <span class="text-sm text-stone-300">Remove all?</span>
              <button type="button" (click)="clearAll()" class="min-h-11 rounded-xl bg-[rgb(var(--panel-danger-heading))] px-4 text-sm font-semibold text-white">Yes, clear</button>
              <button type="button" (click)="confirming.set(false)" class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold hover:bg-stone-800">Cancel</button>
            </div>
          } @else {
            <button type="button" (click)="confirming.set(true)" class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold hover:bg-stone-800">Clear all</button>
          }
        }
      </div>

      @if (titles().length) {
        <div class="mt-8 grid gap-5 md:grid-cols-2">
          @for (product of titles(); track product.id) {
            <article class="flex gap-4 rounded-2xl bg-stone-900 p-5 ring-1 ring-stone-800">
              <img [src]="product.imageUrl" [alt]="product.name" class="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24" />
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-xl font-bold">{{ product.name }}</h2>
                <p class="mt-1 font-semibold">{{ product.price | currency }}</p>
                <div class="mt-3 flex flex-wrap items-center gap-4">
                  <a [routerLink]="['/products', product.id]" class="text-sm font-semibold text-gold-600">View details →</a>
                  <button type="button" (click)="remove(product.id, product.name)" class="min-h-11 text-sm font-semibold text-[rgb(var(--panel-danger-heading))] hover:underline" [attr.aria-label]="'Remove ' + product.name + ' from watchlist'">Remove</button>
                </div>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="mt-8 rounded-3xl bg-stone-900 p-10 text-center ring-1 ring-stone-800">
          <h2 class="text-2xl font-bold">Your watchlist is empty</h2>
          <p class="mt-2 text-stone-400">Tap “Add to watchlist” on any title and it will show up here.</p>
          <a routerLink="/products" class="mt-6 inline-block rounded-xl bg-gold-500 px-5 py-3 font-semibold text-white">Browse titles</a>
        </div>
      }
    </section>
  `,
})
export class WatchlistComponent {
  private readonly cart = inject(CartService);
  private readonly products = inject(ProductService);
  private readonly toast = inject(ToastService);

  readonly confirming = signal(false);
  readonly titles = computed(() => this.products.products.filter((p) => this.cart.has(p.id)));

  remove(id: number, name: string): void {
    this.cart.remove(id);
    this.toast.info(`${name} removed from your watchlist`);
  }

  clearAll(): void {
    this.cart.clear();
    this.confirming.set(false);
    this.toast.info('Watchlist cleared');
  }
}
