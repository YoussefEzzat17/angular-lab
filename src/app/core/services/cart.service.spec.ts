import { TestBed } from '@angular/core/testing';

import { Product } from '../models/product.model';
import { CartService, WATCHLIST_KEY } from './cart.service';
import { FAVORITES_KEY, FavoritesService } from './favorites.service';

const movie = (id: number, stock = 5) => ({ id, stock }) as Product;

function fresh<T>(token: new () => T): T {
  TestBed.resetTestingModule();
  return TestBed.inject(token);
}

describe('watchlist persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  it('adds a title once and reports duplicates and out-of-stock', () => {
    const cart = TestBed.inject(CartService);
    expect(cart.add(movie(1))).toBe('added');
    expect(cart.add(movie(1))).toBe('duplicate');
    expect(cart.add(movie(2, 0))).toBe('out-of-stock');
    expect(cart.count()).toBe(1);
    expect(cart.has(1)).toBeTrue();
  });

  it('survives a reload', () => {
    const cart = TestBed.inject(CartService);
    cart.add(movie(3));
    TestBed.flushEffects();
    expect(JSON.parse(localStorage.getItem(WATCHLIST_KEY)!)).toEqual([3]);

    expect(fresh(CartService).ids()).toEqual([3]);
  });

  it('ignores corrupt saved data', () => {
    localStorage.setItem(WATCHLIST_KEY, '{nope');
    expect(fresh(CartService).count()).toBe(0);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([1, 'x', 1, null, 2]));
    expect(fresh(CartService).ids()).toEqual([1, 2]);
  });

  it('keeps working when storage throws', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    spyOn(Storage.prototype, 'setItem').and.throwError('blocked');
    const cart = TestBed.inject(CartService);
    expect(cart.add(movie(1))).toBe('added');
    expect(() => TestBed.flushEffects()).not.toThrow();
  });

  it('favorites keep ids and added dates across a reload', () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.toggle(4);
    TestBed.flushEffects();
    const date = favorites.addedDates.get(4);
    expect(localStorage.getItem(FAVORITES_KEY)).toContain('"ids":[4]');

    const again = fresh(FavoritesService);
    expect(again.has(4)).toBeTrue();
    expect(again.addedDates.get(4)).toBe(date);
    again.toggle(4);
    TestBed.flushEffects();
    expect(fresh(FavoritesService).has(4)).toBeFalse();
  });
});

describe('CartService removal', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  it('remove() drops one title, clear() drops all, and both persist', () => {
    const cart = TestBed.inject(CartService);
    cart.add(movie(1));
    cart.add(movie(2));
    cart.remove(1);
    expect(cart.ids()).toEqual([2]);
    TestBed.flushEffects();
    expect(JSON.parse(localStorage.getItem(WATCHLIST_KEY)!)).toEqual([2]);

    cart.clear();
    TestBed.flushEffects();
    expect(cart.count()).toBe(0);
    expect(JSON.parse(localStorage.getItem(WATCHLIST_KEY)!)).toEqual([]);
  });
});
